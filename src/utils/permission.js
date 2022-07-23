/*
 * @Description: init
 * @Author: code pro
 * @Date: 2022-06-07 17:57:41
 * @LastEditTime: 2022-06-25 23:14:18
 * @LastEditors: code pro
 */
import router from '../router';
import { getToken, removeToken } from '@/utils/auth';

import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import store from '../store';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ['/login', '/auth-redirect']; // no redirect whitelist

const token = getToken();

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();

  // set page title
  //document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = token;

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' });
      NProgress.done();
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.userType;
      if (hasRoles) {
        next();
      } else {
        try {
          await store.dispatch('auth/getInfo');

          next({ ...to, replace: true });
        } catch (error) {
          // remove token and go to login page to re-login
          removeToken();
          next(`/login`);
          NProgress.done();
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      // next(`/login?redirect=${to.path}`)
      next(`/login`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
