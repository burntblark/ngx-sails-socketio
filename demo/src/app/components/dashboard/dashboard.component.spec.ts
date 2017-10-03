import { TestBed, inject } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';

describe('a dashboard component', () => {
	let component: DashboardComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				DashboardComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([DashboardComponent], (DashboardComponent) => {
		component = DashboardComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});