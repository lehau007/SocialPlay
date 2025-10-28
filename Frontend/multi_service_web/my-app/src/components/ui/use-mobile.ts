import { Injectable, signal, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const MOBILE_BREAKPOINT = 768;

@Injectable({
  providedIn: 'root'
})
export class MobileService {
  private isMobile = signal<boolean>(false);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.checkIsMobile();
      window.addEventListener('resize', () => this.checkIsMobile());
    }
  }

  private checkIsMobile(): void {
    this.isMobile.set(window.innerWidth < MOBILE_BREAKPOINT);
  }

  getIsMobile() {
    return this.isMobile.asReadonly();
  }

  // For compatibility with React-style hook usage
  useIsMobile(): boolean {
    return this.isMobile();
  }
}
