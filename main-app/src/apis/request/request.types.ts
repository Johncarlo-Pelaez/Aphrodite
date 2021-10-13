import {
    Canceler as AxiosCanceler,
    CancelTokenSource as AxiosCancelTokenSource,
  } from 'axios';
  
  export type Canceler = AxiosCanceler | null;
  export type CancelTokenSource = AxiosCancelTokenSource | null;
  