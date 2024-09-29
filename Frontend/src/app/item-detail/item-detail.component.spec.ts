import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemDetailCompenent } from './item-detail.component';

describe('ItemDetailCompenent', () => {
  let component: ItemDetailCompenent;
  let fixture: ComponentFixture<ItemDetailCompenent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemDetailCompenent],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemDetailCompenent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
