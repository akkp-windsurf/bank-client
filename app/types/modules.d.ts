declare module 'utils' {
  export const api: any;
  export const request: any;
  export const routes: any;
}

declare module 'utils/history' {
  const history: any;
  export default history;
}

declare module 'helpers' {
  export const emailValidation: (email: string) => boolean;
}

declare module 'containers/App/selectors' {
  export const makeSelectToken: () => any;
  export const makeSelectOpenedMessage: () => any;
  export const makeSelectMessages: () => any;
  export const makeSelectUser: () => any;
}

declare module 'containers/LoginPage/constants' {
  export const LOGIN_SUCCESS: string;
}

declare module 'containers/DashboardPage/constants' {
  export const CHANGE_LAYOUT: string;
}

declare module 'containers/RegisterPage/constants' {
  export const LOGIN_EXPRESS_SUCCESS: string;
}

declare module 'containers/SettingsPage/constants' {
  export const SET_USER_DATA_SUCCESS: string;
}

declare module 'providers/LanguageProvider/reducer' {
  const reducer: any;
  export default reducer;
}

declare module 'providers/LoadingProvider/reducer' {
  const reducer: any;
  export default reducer;
}

declare module 'providers/ErrorProvider/reducer' {
  const reducer: any;
  export default reducer;
}

declare module 'containers/App/reducer' {
  const reducer: any;
  export default reducer;
}
