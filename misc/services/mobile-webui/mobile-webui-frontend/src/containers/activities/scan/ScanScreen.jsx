import React, { useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { setScannedBarcode } from '../../../actions/ScanActions';
import { updateWFProcess } from '../../../actions/WorkflowActions';
import { pushHeaderEntry } from '../../../actions/HeaderActions';
import { postScannedBarcode } from '../../../api/scanner';
import { getActivityById } from '../../../reducers/wfProcesses';

import BarcodeScannerComponent from '../../../components/BarcodeScannerComponent';

const ScanScreen = () => {
  const {
    url,
    params: { workflowId: wfProcessId, activityId },
  } = useRouteMatch();

  const activityCaption = useSelector((state) => getActivityById(state, wfProcessId, activityId))?.caption;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(pushHeaderEntry({ location: url, caption: activityCaption }));
  }, [url, activityCaption]);

  const history = useHistory();
  const onBarcodeScanned = ({ scannedBarcode }) => {
    //console.log('onBarcodeScanned', { scannedBarcode });

    dispatch(setScannedBarcode({ wfProcessId, activityId, scannedBarcode }));

    return postScannedBarcode({ wfProcessId, activityId, scannedBarcode })
      .then((wfProcess) => {
        //console.log('postScannedBarcode.then', { wfProcess });
        dispatch(updateWFProcess({ wfProcess }));
        history.goBack();
      })
      .catch((error) => {
        dispatch(setScannedBarcode({ wfProcessId, activityId, scannedBarcode: null }));

        throw {
          axiosError: error,
          fallbackMessageKey: 'activities.scanBarcode.invalidScannedBarcode',
        };
      });
  };

  return <BarcodeScannerComponent onResolvedResult={onBarcodeScanned} />;
};

export default ScanScreen;
