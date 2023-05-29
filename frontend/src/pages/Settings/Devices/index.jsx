import React, { useState, useEffect, useRef, useContext } from 'react';

import { AlertContext } from '../../../context/AlertContext';

import justChooseApi from '../../../services/justChooseApi';
import useQuery from '../../../hooks/useQuery';
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
  const [showExitDeviceDialog, setShowExitDeviceDialog] = useState(false);

  const mounted = useRef();

  const clearState = () => {
    setDevices([]);
    setDeviceToExit({});
    setPassword('');
    setDisableExitButton(false);
    setShowExitDeviceDialog(false);
  };

  useEffect(() => {
    mounted.current = true;

    clearState();

    return () => {
      mounted.current = false;
    };
  }, []);

  const { isFetching, data } = useQuery(
    ['settings/devices'],
    async () => {
      const response = await justChooseApi.get('/devices');
      return response.data;
    },
    { retry: false }
  );

  useEffect(() => {
    if (mounted.current && data !== undefined) {
      setDevices(data);
    }
  }, [data]);

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
