class AutoFillService {
  private active = false;

  private usernameRef: HTMLInputElement;

  private passwordRef: HTMLInputElement;

  public init() {
    window.addEventListener('keyup', this.onKeyUp);
  }

  private onKeyUp = (e: KeyboardEvent) => {
    const target = e.target;

    if (target instanceof HTMLInputElement) {
      if (target.name === 'password') {
        this.passwordRef = target;
        this.active = target.value.length > 0;

        console.log(this.active);
      } else if (target.name === 'username') {
        this.usernameRef = target;
      }
    }
  };
}

export default new AutoFillService();
