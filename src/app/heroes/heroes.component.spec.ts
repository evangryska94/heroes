import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HeroesComponent } from './heroes.component';
import { HeroService } from '../hero.service';
import { Observable } from 'rxjs/Rx';

describe('HeroesComponent', () => {
  let component: HeroesComponent;
  let fixture: ComponentFixture<HeroesComponent>;

  class HeroServiceMock {
    //spy on functions and stuffs
    getHeroes (): Observable<Object[]> {
        return Observable.of([new Object]);
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeroesComponent ],
      imports: [RouterTestingModule],
      providers: [
          {provide: HeroService, useClass: HeroServiceMock}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
