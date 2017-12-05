import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DashboardComponent } from './dashboard.component';
import { HeroSearchComponent } from '../hero-search/hero-search.component';

import { HeroService } from '../hero.service';
import { Observable } from 'rxjs/Rx';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  class HeroServiceMock {
    //spy on functions and stuffs
    getHeroes (): Observable<Object[]> {
        return Observable.of([new Object]);
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardComponent, HeroSearchComponent ],
      imports: [RouterTestingModule],
      providers: [
          {provide: HeroService, useClass: HeroServiceMock}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
