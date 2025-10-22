declare module 'vue-cookies' {
  type SameSite = 'Lax' | 'Strict' | 'None'

  interface CookiesConfig {
    expireTimes?: string | number
    path?: string
    domain?: string
    secure?: boolean
    sameSite?: SameSite
  }

  interface VueCookiesType {
    get(name: string): any
    set(
      name: string,
      value: any,
      expireTimes?: string | number,
      path?: string,
      domain?: string,
      secure?: boolean,
      sameSite?: SameSite
    ): void
    remove(name: string, path?: string, domain?: string): void
  }

  const VueCookies: VueCookiesType & {
    install: (app: any, options?: CookiesConfig) => void
  }

  export default VueCookies
}