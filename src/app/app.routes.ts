import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { MetaGuard } from '@wawjs/ngx-core';
import { authenticatedGuard, guestGuard } from '@wawjs/ngx-bos';
import { adminGuard } from './feature/firebase/admin.guard';

/** Redirects to a tab of the admin Settings page. */
const settingsTab = (tab: string) => () => inject(Router).parseUrl(`/admin/company?tab=${tab}`);

export const routes: Routes = [
	{
		path: '',
		redirectTo: 'sign',
		pathMatch: 'full',
	},
	{
		path: '',
		canActivate: [guestGuard],
		loadComponent: () =>
			import('./layouts/guest/guest.component').then(
				(m) => m.GuestComponent,
			),
		children: [
			{
				path: 'sign',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Sign In',
						robots: 'index, follow',
					},
				},
				loadChildren: () =>
					import('./pages/guest/sign/sign.routes').then(
						(m) => m.routes,
					),
			},
		],
	},
	{
		path: '',
		canActivate: [authenticatedGuard],
		loadComponent: () =>
			import('./layouts/user/user.component').then(
				(m) => m.UserComponent,
			),
		children: [
			{
				path: 'dashboard',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Dashboard',
					},
				},
				loadChildren: () =>
					import('./pages/user/dashboard/dashboard.routes').then(
						(m) => m.routes,
					),
			},
			{
				path: 'profile',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'My profile',
					},
				},
				loadChildren: () =>
					import('./pages/user/profile/profile.routes').then(
						(m) => m.routes,
					),
			},
			{
				path: 'settings',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'My settings',
					},
				},
				loadChildren: () =>
					import('./pages/user/settings/settings.routes').then(
						(m) => m.routes,
					),
			},
			{
				path: 'tasks',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Tasks',
					},
					// Employees see only the tasks they created.
					scope: 'mine',
				},
				loadChildren: () =>
					import('./pages/tasks/tasks.routes').then(
						(m) => m.routes,
					),
			},
			{
				path: 'customers',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Customers',
					},
					// Employees see only the customers they created.
					scope: 'mine',
				},
				loadChildren: () =>
					import('./pages/customers/customers.routes').then(
						(m) => m.routes,
					),
			},
			{
				path: 'products',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Products',
					},
					// Employees see only the products they created.
					scope: 'mine',
				},
				loadChildren: () =>
					import('./pages/products/products.routes').then(
						(m) => m.routes,
					),
			},
			{
				path: 'orders',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Orders',
					},
					// Employees see only the orders they created.
					scope: 'mine',
				},
				loadChildren: () =>
					import('./pages/orders/orders.routes').then(
						(m) => m.routes,
					),
			},
			{
				path: 'notifications',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Notifications',
					},
				},
				loadChildren: () =>
					import('./pages/user/notifications/notifications.routes').then(
						(m) => m.routes,
					),
			},
		],
	},
	{
		path: 'admin',
		canActivate: [authenticatedGuard, adminGuard],
		loadComponent: () =>
			import('./layouts/user/user.component').then(
				(m) => m.UserComponent,
			),
		children: [
			// Forms, translations and employees are tabs of the admin Settings page now.
			{ path: 'forms', pathMatch: 'full', redirectTo: settingsTab('forms') },
			{
				path: 'form/:formId',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Forms',
					},
				},
				loadChildren: () =>
					import('@wawjs/ngx-bos').then((m) => m.formRoutes),
			},
			{ path: 'translates', pathMatch: 'full', redirectTo: settingsTab('translations') },
			{ path: 'employees', pathMatch: 'full', redirectTo: settingsTab('employees') },
			{ path: 'roles', pathMatch: 'full', redirectTo: settingsTab('employees') },
			{
				path: 'customers',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Customers',
					},
					// Admins see the customers of everyone.
					scope: 'all',
				},
				loadChildren: () =>
					import('./pages/customers/customers.routes').then(
						(m) => m.routes,
					),
			},
			{
				path: 'products',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Products',
					},
					// Admins see the products of everyone.
					scope: 'all',
				},
				loadChildren: () =>
					import('./pages/products/products.routes').then(
						(m) => m.routes,
					),
			},
			{
				path: 'orders',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Orders',
					},
					// Admins see the orders of everyone.
					scope: 'all',
				},
				loadChildren: () =>
					import('./pages/orders/orders.routes').then(
						(m) => m.routes,
					),
			},
			{
				path: 'tasks',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Tasks',
					},
					// Admins see the tasks of everyone.
					scope: 'all',
				},
				loadChildren: () =>
					import('./pages/tasks/tasks.routes').then(
						(m) => m.routes,
					),
			},
			{
				path: 'activity',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Activity log',
					},
				},
				loadChildren: () =>
					import('./pages/admin/activity/activity.routes').then(
						(m) => m.routes,
					),
			},
			{
				path: 'company',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Settings',
					},
				},
				loadChildren: () =>
					import('./pages/admin/company/company.routes').then(
						(m) => m.routes,
					),
			},
		],
	},
	{
		path: '**',
		redirectTo: 'profile',
		pathMatch: 'full',
	},
];
