import { Component, inject } from '@angular/core';
import {
	AlertService,
	ButtonComponent,
	ThemeComponent,
} from '@wawjs/ngx-ui';
import { FirebaseEmployeesService } from '../../../feature/firebase/firebase-employees.service';
import { UserService } from '@wawjs/ngx-bos';
import {
	LanguageService,
	TranslateDirective,
	TranslateService,
} from '@wawjs/ngx-translate';
import { FirebaseErrorService } from '../../../feature/firebase/firebase-errors';

@Component({
	imports: [
		ButtonComponent,
		ThemeComponent,
		TranslateDirective,
	],
	templateUrl: './settings.component.html',
	styleUrl: './settings.component.scss',
})
export class SettingsComponent {
	readonly userService = inject(UserService);
	readonly languageService = inject(LanguageService);
	readonly translateService = inject(TranslateService);
	readonly employees = inject(FirebaseEmployeesService);
	private readonly _alertService = inject(AlertService);
	private readonly _errors = inject(FirebaseErrorService);

	constructor() {
		void this.employees.checkSelf();
	}

	readonly languages = this.languageService.languages();

	flag(code: string): string {
		switch (code) {
			case 'ua':
			case 'uk':
				return 'flags/ukraine.svg';
			case 'en':
				return 'flags/united-kingdom.svg';
			default:
				return '';
		}
	}

	/** Asks the administrators for employee access. */
	async requestAccess(): Promise<void> {
		try {
			await this.employees.requestAccess();

			this._alertService.success({
				text: this.translateService.translate('Your request was sent')(),
			});
		} catch (error) {
			this._errors.report(error, '[employees]');
		}
	}

	setLanguage(code: string): void {
		if (code === this.languageService.language()) return;

		void this.translateService.setLanguage(code);
	}
}
