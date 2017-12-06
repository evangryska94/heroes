import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {DebugElement} from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Rx';

import { HttpClientModule } from '@angular/common/http';

import { DashboardComponent } from './dashboard.component';
import { HeroSearchComponent } from '../hero-search/hero-search.component';

import { HeroService } from '../hero.service';
import { Hero } from '../hero';
import { MessageService } from '../message.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let de:      DebugElement;
  let el:      HTMLElement;
  let rootEl:      HTMLElement;
  let heroService;
  let spy;
  let heroes: Hero[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardComponent, HeroSearchComponent ],
      imports: [RouterTestingModule, HttpClientModule],
      providers: [ HeroService, MessageService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;

    rootEl = fixture.debugElement.nativeElement;
    heroService = TestBed.get(HeroService);

    let hero1 = new Hero(1, "hero1");
    let hero2 = new Hero(2, "hero2");
    let hero3 = new Hero(3, "hero3");
    heroes = [hero1, hero2, hero3];

    //spy on getHeroes
    spy = spyOn(heroService, 'getHeroes')
      .and.returnValue(Observable.of(heroes));

    //assign debug element with css selector

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
