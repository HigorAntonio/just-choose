import { useContext, useEffect } from 'react';
import { Redirect, Route } from 'react-router';

import { AuthContext } from '../../context/AuthContext';
import { ProfileContext } from '../../context/ProfileContext';
import { AlertContext } from '../../context/AlertContext';

const CustomRoute = ({ isPrivate, requiresUserActivation, ...rest }) => {
  const { loading: loadingAuth, authenticated } = useContext(AuthContext);
  const {
    loading: loadingProfile,
    loadingError: loadingProfileError,
    userProfile: { is_active: isActive },
  } = useContext(ProfileContext);

  const {
    setMessage,
    setSeverity,
    setShow: setShowAlert,
    duration: alertTimeout,
    setDuration: setAlertTimeout,
  } = useContext(AlertContext);

  useEffect(() => {
    if (!loadingAuth && isPrivate && !authenticated) {
      setSeverity('info');
      setMessage('Para acessar a página você precisar estar logado.');
      setShowAlert(true);
      clearTimeout(alertTimeout);
      setAlertTimeout(setTimeout(() => setShowAlert(false), 4000));
    } else if (
      !loadingProfile &&
      !loadingProfileError &&
      requiresUserActivation &&
      !isActive
    ) {
      setSeverity('info');
      setMessage('Para acessar a página você precisa confirmar seu e-mail.');
      setShowAlert(true);
      clearTimeout(alertTimeout);
      setAlertTimeout(setTimeout(() => setShowAlert(false), 4000));
    }
  }, [
    isPrivate,
    requiresUserActivation,
    loadingAuth,
    authenticated,
    loadingProfile,
    loadingProfileError,
    isActive,
    setSeverity,
    setMessage,
    setShowAlert,
    alertTimeout,
    setAlertTimeout,
  ]);

  if (loadingAuth || loadingProfile) return null;

  if (isPrivate && !authenticated) {
    return <Redirect to="/" />;
  }

  if (requiresUserActivation && !loadingProfileError && !isActive) {
    return <Redirect to="/" />;
  }

  return <Route {...rest} />;
};

export default CustomRoute;
