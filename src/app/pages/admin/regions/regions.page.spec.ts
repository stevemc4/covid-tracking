import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegionsPage } from './regions.page';

describe('RegionsPage', () => {
  let component: RegionsPage;
  let fixture: ComponentFixture<RegionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RegionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
