import { useContext, useEffect } from 'react';
import { Redirect, Route } from 'react-router';

import { AuthContext } from '../../context/AuthContext';
import { AlertContext } from '../../context/AlertContext';

const CustomRoute = ({ isPrivate, requiresProfileActivation, ...rest }) => {
  const { isLoading, isError, authentication } = useContext(AuthContext);

  const {
    setMessage,
    setSeverity,
    setShow: setShowAlert,
    duration: alertTimeout,
    setDuration: setAlertTimeout,
  } = useContext(AlertContext);

  useEffect(() => {
    if (!isLoading && !isError && isPrivate && !authentication) {
      setSeverity('info');
      setMessage('Para acessar a página você precisar estar logado.');
      setShowAlert(true);
      clearTimeout(alertTimeout);
      setAlertTimeout(setTimeout(() => setShowAlert(false), 4000));
    } else if (
      !isLoading &&
      !isError &&
      requiresProfileActivation &&
      authentication &&
      authentication.profile &&
      authentication.profile.is_active === false
    ) {
      setSeverity('info');
      setMessage('Para acessar a página você precisa confirmar seu e-mail.');
      setShowAlert(true);
      clearTimeout(alertTimeout);
      setAlertTimeout(setTimeout(() => setShowAlert(false), 4000));
    }
  }, [
    isPrivate,
    requiresProfileActivation,
    isLoading,
    isError,
    authentication,
    setSeverity,
    setMessage,
    setShowAlert,
    alertTimeout,
    setAlertTimeout,
  ]);

  if (isLoading) return null;

  if (isPrivate && !authentication) {
    return <Redirect to="/" />;
  }

  if (
    requiresProfileActivation &&
    !isError &&
    authentication &&
    authentication.profile &&
    authentication.profile.is_active === false
  ) {
    return <Redirect to="/" />;
  }

  return <Route {...rest} />;
};

export default CustomRoute;
