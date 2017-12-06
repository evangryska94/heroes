import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Rx';

import { HttpClientModule } from '@angular/common/http';

import { DashboardComponent } from './dashboard.component';
import { HeroSearchComponent } from '../hero-search/hero-search.component';

import { HeroService } from '../hero.service';
import { Hero } from '../hero';
import { HEROES } from '../mock-heroes';
import { MessageService } from '../message.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let de:      DebugElement;
  let el:      HTMLElement;
  let rootEl:      HTMLElement;
  let heroService;
  let spy;

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

    //spy on getHeroes
    spy = spyOn(heroService, 'getHeroes')
      .and.returnValue(Observable.of(HEROES));

    //assign debug element with css selector
    de = fixture.debugElement.query(By.css('.grid'));
    el = de.nativeElement;
  });

  it('should not call getHeroes before onInit', () => {
    expect(el.innerText).toBe('', 'nothing displayed');
    expect(component.heroes.length).toBe(0);
    expect(spy.calls.any()).toBe(false, 'getHeroes not yet called');
  });

  it('should create dashboard component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call getHeroes and populate heroes array onInit', () => {
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);

    let foundHeroes = component.heroes;

    expect(foundHeroes.length).toEqual(4);
    expect(foundHeroes).toEqual(HEROES.slice(1,5));
  });

  it('should populate heroes grid on dashboard with mock data', () => {
    fixture.detectChanges();
    let pageData = el.innerHTML;
    let displayedHeroes = fixture.debugElement.queryAll(By.css('.module.hero'));

    expect(displayedHeroes.length).toEqual(4);

    expect(pageData).toContain('ng-reflect-router-link="/detail/12"');
    expect(displayedHeroes[0].nativeElement.innerText).toContain('Narco');

    expect(pageData).toContain('ng-reflect-router-link="/detail/13"');
    expect(displayedHeroes[1].nativeElement.innerText).toContain('Bombasto');

    expect(pageData).toContain('ng-reflect-router-link="/detail/14"');
    expect(displayedHeroes[2].nativeElement.innerText).toContain('Celeritas');

    expect(pageData).toContain('ng-reflect-router-link="/detail/15"');
    expect(displayedHeroes[3].nativeElement.innerText).toContain('Magneta');
  });
});
