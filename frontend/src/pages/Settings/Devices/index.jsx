import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';

import { AlertContext } from '../../../context/AlertContext';

import justChooseApi from '../../../services/justChooseApi';
import Modal from '../../../components/Modal';
import ConfirmExitDeviceDialog from '../ConfirmExitDeviceDialog';

import {
  Container,
  LayoutBox,
  Device,
  DeviceOS,
  DeviceBrowser,
  ExitButton,
} from './styles';

const Devices = () => {
  const {
    setMessage,
    setSeverity,
    setShow: setShowAlert,
    duration: alertTimeout,
    setDuration: setAlertTimeout,
  } = useContext(AlertContext);

  const [devices, setDevices] = useState([]);
  const [deviceToExit, setDeviceToExit] = useState({});
  const [password, setPassword] = useState('');
  const [disableExitButton, setDisableExitButton] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [denyAccess, setDenyAccess] = useState(false);
  const [showExitDeviceDialog, setShowExitDeviceDialog] = useState(false);

  const mounted = useRef();
  const source = useRef();

  const clearState = () => {
    setDevices([]);
    setDeviceToExit({});
    setPassword('');
    setDisableExitButton(false);
    setLoading(true);
    setLoadingError(false);
    setNotFound(false);
    setDenyAccess(false);
    setShowExitDeviceDialog(false);
  };

  useEffect(() => {
    console.debug('deviceToExit:', deviceToExit);
  }, [deviceToExit]);

  useEffect(() => {
    mounted.current = true;
    source.current = axios.CancelToken.source();

    (async () => {
      try {
        clearState();
        const { data } = await justChooseApi.get(`/devices`, {
          cancelToken: source.current.token,
        });
        setDevices(data);
        setLoading(false);
      } catch (error) {
        if (axios.isCancel(error)) {
          return;
        }
        if (error.response && error.response.status === 400) {
          setNotFound(true);
        } else if (error.response && error.response.status === 401) {
          setDenyAccess(true);
        } else {
          setLoadingError(true);
        }
        setLoading(false);
      }
    })();

    return () => {
      mounted.current = false;
      source.current.cancel();
    };
  }, []);

  useEffect(() => {
    if (!showExitDeviceDialog) {
      setPassword('');
    }
  }, [showExitDeviceDialog]);

  const handleExitButton = (device) => {
    setShowExitDeviceDialog(true);
    setDeviceToExit(device);
  };

  const handleExitDevice = async (deviceId) => {
    try {
      setDisableExitButton(true);
      setShowExitDeviceDialog(false);
      clearTimeout(alertTimeout);
      setMessage('Por favor, aguarde. Desconectando dispositivo...');
      setSeverity('info');
      setShowAlert(true);
      await justChooseApi.delete('/devices', {
        data: { password, device_id: deviceId },
      });
      setMessage('Dispositivo desconectado com sucesso.');
      setSeverity('success');
      setAlertTimeout(setTimeout(() => setShowAlert(false), 4000));
      if (mounted.current) {
        setDevices((prevState) =>
          prevState.filter((device) => device.id !== deviceId)
        );
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data.message === 'incorrect password'
      ) {
        setMessage('Senha incorreta. Por favor, tente novamente.');
      } else {
        setMessage(
          'Não foi possível desconectar o dispositivo. Por favor, tente novamente.'
        );
      }
      setSeverity('error');
      setAlertTimeout(setTimeout(() => setShowAlert(false), 4000));
    }
    if (mounted.current) {
      setDeviceToExit({});
      setPassword('');
      setDisableExitButton(false);
    }
  };

  return (
    <Container>
      <h3>Dispositivos</h3>
      {devices.length > 0 && (
        <LayoutBox>
          {devices.map((device) => (
            <Device key={device.id}>
              <div>
                <DeviceOS>{device.os}</DeviceOS>
                <DeviceBrowser>{device.browser}</DeviceBrowser>
              </div>
              <ExitButton
                onClick={() => handleExitButton(device)}
                disabled={disableExitButton}
              >
                Sair
              </ExitButton>
            </Device>
          ))}
        </LayoutBox>
      )}
      <Modal show={showExitDeviceDialog} setShow={setShowExitDeviceDialog}>
        <ConfirmExitDeviceDialog
          deviceOS={deviceToExit.os}
          password={password}
          setPassword={setPassword}
          handleConfirm={() => handleExitDevice(deviceToExit.id)}
        />
      </Modal>
    </Container>
  );
};

export default Devices;
