import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env';
import { SpiderComponent } from '@wawjs/ngx-bos';
import { AlertService, ButtonComponent, ThemeComponent } from '@wawjs/ngx-ui';
import { User, UserService } from '@wawjs/ngx-bos';
import { HttpService } from '@wawjs/ngx-http';
import { TranslateDirective, TranslateService } from '@wawjs/ngx-translate';
import { FirebaseAuthService } from '../../../feature/firebase/firebase-auth.service';

@Component({
	imports: [SpiderComponent, ButtonComponent, ThemeComponent, TranslateDirective],
	templateUrl: './sign.component.html',
	styleUrl: './sign.component.scss',
})
export class SignComponent {
	userService = inject(UserService);
	readonly translateService = inject(TranslateService);
	private _alertService = inject(AlertService);
	private _httpService = inject(HttpService);
	private _router = inject(Router);
	private _firebaseAuth = inject(FirebaseAuthService);

	readonly logo = environment.sign.logo;
	readonly isSubmitting = signal(false);

	constructor() {
		// Load Firebase now so the popup can open straight from the click, and clear any old Firebase
		// session (this page is where every logout lands).
		this._firebaseAuth.prepare().catch(() => undefined);
	}

	async signInWithGoogle(): Promise<void> {
		if (this.isSubmitting()) return;

		this.isSubmitting.set(true);

		try {
			const idToken = await this._firebaseAuth.signInWithGoogle();

			// The person closed the Google window: nothing to report.
			if (!idToken) {
				this.isSubmitting.set(false);

				return;
			}

			this._httpService.post(
				'/api/user/firebase',
				{ idToken },
				this._set.bind(this),
				this._handleRequestError.bind(this),
			);
		} catch {
			this._handleRequestError();
		}
	}

	private _set(user: User) {
		if (!user) {
			this._handleRequestError();

			return;
		}

		const token = (user as unknown as { token: string }).token || '';
		if (token) this._httpService.set('token', token);

		// setUser() persists the user to localStorage.
		this.userService.setUser(user);
		this.userService.loadUsers();
		this._router.navigateByUrl('/profile');
	}

	private _handleRequestError(): void {
		this.isSubmitting.set(false);
		this._alertService.error({
			text: this.translateService.translate('Could not sign in with Google')(),
		});
	}
}
