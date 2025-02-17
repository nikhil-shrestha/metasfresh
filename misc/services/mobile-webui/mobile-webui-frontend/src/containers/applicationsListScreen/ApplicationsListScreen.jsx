import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getAvailableApplicationsArray } from '../../reducers/applications';

import ScreenToaster from '../../components/ScreenToaster';
import ApplicationButton from './ApplicationButton';
import LogoHeader from '../../components/LogoHeader';
import { useHistory } from 'react-router-dom';
import { getApplicationStartFunction } from '../../apps';
import { appLaunchersLocation } from '../../routes/launchers';
import { useAuth } from '../../hooks/useAuth';

const ApplicationsListScreen = () => {
  const applications = useSelector((state) => getAvailableApplicationsArray(state));

  useEffect(() => {
    document.title = 'mobile UI';
  }, []);

  const dispatch = useDispatch();
  const history = useHistory();
  const handleAppClick = (applicationId) => {
    const startApplicationFunc = getApplicationStartFunction(applicationId);
    if (startApplicationFunc) {
      dispatch(startApplicationFunc());
    } else {
      history.push(appLaunchersLocation({ applicationId }));
    }
  };

  const auth = useAuth();
  const handleLogout = () => {
    auth.logout();
  };

  return (
    <div>
      <LogoHeader />
      <div className="section">
        {applications.map((app) => (
          <ApplicationButton
            key={app.id}
            caption={app.caption}
            iconClassNames={app.iconClassNames}
            onClick={() => handleAppClick(app.id)}
          />
        ))}
        <br />
        <ApplicationButton
          key="logout"
          caption={'Logout'}
          iconClassNames="fas fa-sign-out-alt"
          onClick={() => handleLogout()}
        />
      </div>
      <ScreenToaster />
    </div>
  );
};

export default ApplicationsListScreen;
