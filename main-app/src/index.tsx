import React from 'react';
import ReactDOM from 'react-dom';
import { PublicClientApplication } from '@azure/msal-browser';
import App from './App';
import './styles/main.scss';
import { buildMsalConfig } from 'authConfig';
import { queryClient } from 'query-client';
import axios from 'axios';

(async () => {
  const res = await axios.get<{
    azureAdClientId: string;
    azureAdTenantId: string;
  }>('/api/app/msal');
  const msalConfig = buildMsalConfig(
    res.data.azureAdClientId,
    res.data.azureAdTenantId,
  );
  const msalInstance = new PublicClientApplication(msalConfig);

  ReactDOM.render(
    <React.StrictMode>
      <App msalInstance={msalInstance} queryClient={queryClient} />
    </React.StrictMode>,
    document.getElementById('root'),
  );
})();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
