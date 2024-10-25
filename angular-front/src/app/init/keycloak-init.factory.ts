import { KeycloakService } from 'keycloak-angular';

export function initKeycloak (keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'https://login.oscarrovira.com/',
        realm: 'The Black Bools',
        clientId: 'medicaplus',
      },
      initOptions: {
        onLoad: 'check-sso',
        checkLoginIframe: false
      },
      enableBearerInterceptor: true,
      loadUserProfileAtStartUp: true,
      bearerPrefix: 'Bearer',
    });
}

