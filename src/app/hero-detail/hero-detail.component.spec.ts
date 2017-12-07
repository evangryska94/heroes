import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule }    from '@angular/forms';
import { Observable } from 'rxjs/Rx';

import { HttpClientModule } from '@angular/common/http';

import { HeroDetailComponent } from './hero-detail.component';

import { HeroService } from '../hero.service';
import { Hero } from '../hero';
import { MessageService } from '../message.service';

describe('DashboardComponent', () => {
  let component: HeroDetailComponent;
  let fixture: ComponentFixture<HeroDetailComponent>;
  let de:      DebugElement;
  let el:      HTMLElement;
  let rootEl:      HTMLElement;
  let heroService;
  let spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeroDetailComponent ],
      imports: [ RouterTestingModule, HttpClientModule, FormsModule ],
      providers: [ HeroService, MessageService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroDetailComponent);
    component = fixture.componentInstance;
    let expectedHero = new Hero(1, 'TestHero');
    // component.hero = expectedHero;

    rootEl = fixture.debugElement.nativeElement;
    heroService = TestBed.get(HeroService);

    //spy on getHeroes
    spy = spyOn(heroService, 'getHero')
      .and.returnValue(Observable.of(expectedHero)); //make this return specific values given specific ids

    //assign debug element with css selector
    // de = fixture.debugElement.query(By.css('.grid'));
    // el = de.nativeElement;
  });

  it('should create dashboard component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    // expect(component.hero).toBeFalsy();
  });
});
