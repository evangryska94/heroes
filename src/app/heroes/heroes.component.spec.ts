import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { HeroesComponent } from './heroes.component';
import { HeroService } from '../hero.service';
import { Hero } from '../hero';
import { HEROES } from '../mock-heroes';
import { MessageService } from '../message.service';

describe('HeroesComponent', () => {
  let component: HeroesComponent;
  let fixture: ComponentFixture<HeroesComponent>;
  let rootEl:      HTMLElement;

  let heroService;
  let getHeroesSpy;
  let addHeroesSpy;
  let deleteHeroesSpy;

  let heroName = 'TestHero'
  let hero = new Hero(21, heroName);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeroesComponent ],
      imports: [ RouterTestingModule, HttpClientModule ],
      providers: [ HeroService, MessageService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroesComponent);
    component = fixture.componentInstance;

    rootEl = fixture.debugElement.nativeElement;
    heroService = TestBed.get(HeroService);

    //spy on getHeroes (init)
    getHeroesSpy = spyOn(heroService, 'getHeroes')
      .and.returnValue(Observable.of(HEROES));

    //spy on addHero
    addHeroesSpy = spyOn(heroService, 'addHero')
      .and.returnValue(Observable.of(hero));

    //spy on deleteHero
    deleteHeroesSpy = spyOn(heroService, 'deleteHero')
      .and.returnValue(Observable.of(hero));

    //assign debug element per test
  });

  it('should create heroes component', () => {
    fixture.detectChanges();    
    expect(component).toBeTruthy();
  });

  it('should call getHeroes and populate heroes array onInit', () => {
    fixture.detectChanges();
    expect(getHeroesSpy).toHaveBeenCalledTimes(1);

    let foundHeroes = component.heroes;

    expect(foundHeroes.length).toEqual(10);
    expect(foundHeroes).toEqual(HEROES);
  });

  it('should populate heroes list on component with mock data', () => {
    let de = fixture.debugElement.query(By.css('.heroes'));

    fixture.detectChanges();
    let heroesList = de.queryAll(By.css('li'));

    expect(heroesList.length).toEqual(10);

    HEROES.forEach((hero, index) => {
      let listItem = heroesList[index];

      //test each list item is a router link
      expect(listItem.nativeElement.innerHTML).toContain(`ng-reflect-router-link="/detail/${hero.id}"`);
      expect(listItem.nativeElement.innerHTML).toContain(`href="/detail/${hero.id}"`);

      //test each list item has a badge class with text of hero id
      expect(listItem.query(By.css('.badge')).nativeElement.innerText).toBe(`${hero.id}`);

      //test each list item contains the hero's name
      expect(listItem.nativeElement.innerText).toContain(`${hero.name}`);

      //test each list item has a delete button associated
      expect(listItem.query(By.css('button')).nativeElement.className).toBe('delete');
    })
  });

  it('should not call getHeroes before onInit', () => {
    let heroesList = fixture.debugElement.query(By.css('.heroes')).nativeElement;
    expect(heroesList.innerText).toBe('', 'nothing displayed');

    expect(component.heroes).toBeFalsy();
    expect(getHeroesSpy.calls.any()).toBe(false, 'getHeroes not yet called');
  });

  it('should create add heroes div', () => {
    fixture.detectChanges();
    let addHeroDiv = fixture.debugElement.query(By.css('div'));

    let addHeroLabel = addHeroDiv.query(By.css('label'));
    expect(addHeroLabel.nativeElement.innerText).toContain('Hero name:');
    expect(addHeroLabel.query(By.css('input'))).toBeTruthy();

    let addHeroButton = addHeroDiv.query(By.css('button'));
    expect(addHeroButton.nativeElement.innerText).toContain('add');
  });

  it('should add hero on button click', () => {
    fixture.detectChanges();
    let addHeroButton = fixture.debugElement.query(By.css('button'));
    let inputHeroName = fixture.debugElement.query(By.css('input')).nativeElement;
    inputHeroName.value = heroName;

    addHeroButton.triggerEventHandler('click', { button: 0 });

    expect(component.heroes.length).toBe(11);
    expect(addHeroesSpy).toHaveBeenCalledTimes(1);
  });

  it('should delete hero on button click', () => {
    fixture.detectChanges();
    let deleteButtons = fixture.debugElement.queryAll(By.css('.delete'));
    //get delete button for last added hero, TestHero
    let deleteTestHeroButton = deleteButtons[deleteButtons.length - 1]

    deleteTestHeroButton.triggerEventHandler('click', { button: 0 });

    expect(component.heroes.length).toBe(10);
    expect(deleteHeroesSpy).toHaveBeenCalledTimes(1);
  });
});
