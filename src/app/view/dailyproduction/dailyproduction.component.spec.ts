import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyproductionComponent } from './dailyproduction.component';

describe('DailyproductionComponent', () => {
  let component: DailyproductionComponent;
  let fixture: ComponentFixture<DailyproductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyproductionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyproductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
