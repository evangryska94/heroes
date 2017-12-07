import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { ActivatedRoute } from '@angular/router';
import { FormsModule }    from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { By } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

import { HeroDetailComponent } from './hero-detail.component';

import { HeroService } from '../hero.service';
import { Hero } from '../hero';
import { MessageService } from '../message.service';

describe('HeroDetailComponent', () => {
  let component: HeroDetailComponent;
  let fixture: ComponentFixture<HeroDetailComponent>;
  let de:      DebugElement;
  let el:      HTMLElement;
  let rootEl:      HTMLElement;

  let heroService;
  let route;
  let location;

  let expectedHero = new Hero(1, 'TestHero');;
  let getHeroSpy;
  let updateHeroSpy;
  let locationSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeroDetailComponent ],
      imports: [ RouterTestingModule, HttpClientModule, FormsModule ],
      providers: [ HeroService, MessageService, {provide: LocationStrategy, useClass: PathLocationStrategy} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroDetailComponent);
    component = fixture.componentInstance;

    rootEl = fixture.debugElement.nativeElement;
    heroService = TestBed.get(HeroService);
    route = TestBed.get(ActivatedRoute);
    location = TestBed.get(Location);

    //spy on getHero
    getHeroSpy = spyOn(heroService, 'getHero')
      .and.callFake(() => {
        if(route.snapshot.paramMap.get('id') == 1) return Observable.of(expectedHero);
        else return Observable.empty();
      });

    locationSpy = spyOn(location, 'back').and.stub();

    updateHeroSpy = spyOn(heroService, 'updateHero')
      .and.callFake(() => {
        return Observable.empty();
      });
  });

  it('should create hero detail component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.hero).toBeFalsy();
  });

  it('should not render html if no hero is found for the given id', () => {
    route.snapshot.params = {id: "0"};

    fixture.detectChanges();
    expect(getHeroSpy).toHaveBeenCalledTimes(1);
    expect(component.hero).toBeFalsy();

    de = fixture.debugElement.query(By.css('div'));
    expect(de).toBeNull();
  });

  it('should render html when hero is found for the given id', () => {
    route.snapshot.params = {id: "1"};

    fixture.detectChanges();
    expect(getHeroSpy).toHaveBeenCalledTimes(1);
    expect(component.hero).toBe(expectedHero);

    de = fixture.debugElement.query(By.css('div'));
    el = de.nativeElement;
    expect(de).not.toBeNull();

    let heroDetailsh2 = de.query(By.css('h2')).nativeElement;
    expect(heroDetailsh2.innerText).toContain(expectedHero.name.toUpperCase());

    let heroDetailsDiv = de.query(By.css('h2 ~ div')).nativeElement;
    expect(heroDetailsDiv.innerText).toContain(expectedHero.id);

    let heroDetailsInput = de.query(By.css('input')).nativeElement;
    expect(heroDetailsInput.getAttribute('ng-reflect-model')).toBe(expectedHero.name);

    let heroDetailButtons = de.queryAll(By.css('button'));
    expect(heroDetailButtons.length).toBe(2);
    expect(heroDetailButtons[0].nativeElement.innerText).toBe('go back');
    expect(heroDetailButtons[1].nativeElement.innerText).toBe('save');
  });

  it('should go back to the previous page when back button is clicked', () => {
    route.snapshot.params = {id: "1"};
    fixture.detectChanges();

    de = fixture.debugElement.query(By.css('div'));
    let backButton = de.queryAll(By.css('button'))[0];

    backButton.triggerEventHandler('click', { button: 0 });

    expect(locationSpy).toHaveBeenCalledTimes(1);
  });

  it('should call update hero with the given input', () => {
    route.snapshot.params = {id: "1"};

    fixture.detectChanges();
    de = fixture.debugElement.query(By.css('div'));
    let updateButton = de.queryAll(By.css('button'))[1];

    updateButton.triggerEventHandler('click', { button: 0 });

    expect(component.hero).toBe(expectedHero);
    expect(updateHeroSpy).toHaveBeenCalledTimes(1);
    expect(updateHeroSpy).toHaveBeenCalledWith(component.hero);
  });
});
