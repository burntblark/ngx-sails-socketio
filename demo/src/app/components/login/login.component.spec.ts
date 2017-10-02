import { TestBed, inject } from '@angular/core/testing';

import { LoginComponent } from './login.component';

describe('a login component', () => {
	let component: LoginComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				LoginComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([LoginComponent], (LoginComponent) => {
		component = LoginComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});