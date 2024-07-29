import React, { useEffect, useRef, useState } from 'react';

import { create, Workbench } from '@dtinsight/molecule';
import '@dtinsight/molecule/esm/style/mo.css';
import InstanceService from '@dtinsight/molecule/esm/services/instanceService';
import extensions from './extensions';
import './App.css';

function App(): React.ReactElement {
	const refMoInstance = useRef<InstanceService>();
	const [MyWorkbench, setMyWorkbench] = useState<React.ReactElement>();

	useEffect(() => {
		if (!refMoInstance.current) {
			refMoInstance.current = create({
				extensions,
			});
			if (refMoInstance.current) {
				const IDE = () => refMoInstance.current?.render(<Workbench />);
				setMyWorkbench(IDE);
			}
		}
	}, []);

	return <div>{MyWorkbench}</div>;
}

export default App;
