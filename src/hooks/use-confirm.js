/*
 * @Description: confirm form
 * @Author: code pro
 * @Date: 2022-06-13 15:51:44
 * @LastEditTime: 2022-06-25 23:12:06
 * @LastEditors: Ian
 */
import { useConfirm } from 'primevue/useconfirm';
export function useInitConfirm() {
  const confirm = useConfirm();
  const confirmProcess = (params = {}) => {
    const {
      header = 'Confirmation',
      message = 'Are you sure you want to proceed',
      icon = 'pi pi-exclamation-triangle',
      acceptClass = 'p-button-danger',
      acceptCb,
      reJectCb,
    } = params;
    confirm.require({
      message: message,
      header: header,
      icon: icon,
      acceptClass: acceptClass,
      accept: () => {
        if (typeof acceptCb === 'function') {
          acceptCb();
        }
      },
      reject: () => {
        if (typeof reJectCb === 'function') {
          reJectCb();
        }
      },
    });
  };

  return {
    confirmProcess,
  };
}
