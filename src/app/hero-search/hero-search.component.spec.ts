import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';

import { Observable } from 'rxjs/Rx';
import { By } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule }    from '@angular/forms';

import { HeroSearchComponent } from './hero-search.component';
import { HeroService } from '../hero.service';
import { Hero } from '../hero';
import { MessageService } from '../message.service';

describe('HeroSearchComponent', () => {
  let component: HeroSearchComponent;
  let fixture: ComponentFixture<HeroSearchComponent>;

  let de:      DebugElement;
  let el:      HTMLElement;
  let rootEl:      HTMLElement;

  let heroService;
  let searchSpy;

  let testHero1 = new Hero(0, "TestHero1");
  let testHero2 = new Hero(1, "TestHero2");
  let testResultArray = [testHero1, testHero2];

  let searchResults = {
    "nothing": Observable.empty(),
    "Test": Observable.of(testResultArray),
    "": Observable.empty()
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [ HeroSearchComponent ],
        imports: [ RouterTestingModule, HttpClientModule ],
        providers: [ HeroService, MessageService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroSearchComponent);
    component = fixture.componentInstance;

    heroService = TestBed.get(HeroService);

    searchSpy = spyOn(heroService, 'searchHeroes')
      .and.callFake((param) => {
        return searchResults[param];
      });
  });

  it('should create hero search component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should not list any heros if nothing is found', fakeAsync(() => {
    fixture.detectChanges();

    let inputBox = fixture.debugElement.query(By.css('#search-box'));
    let inputBoxElement = inputBox.nativeElement;

    inputBoxElement.value = "nothing";
    inputBox.triggerEventHandler('keyup', null);

    tick(300);
    expect(searchSpy).toHaveBeenCalledTimes(1);

    let foundHeroes = fixture.debugElement.query(By.css('li'));
    expect(foundHeroes).toBeNull();
  }));

  it('should only search once if form value doesnt change', fakeAsync(() => {
    fixture.detectChanges();

    let inputBox = fixture.debugElement.query(By.css('#search-box'));
    let inputBoxElement = inputBox.nativeElement;

    inputBoxElement.value = "nothing";
    inputBox.triggerEventHandler('keyup', null);

    tick(300);
    expect(searchSpy).toHaveBeenCalledTimes(1);

    inputBox.triggerEventHandler('keyup', null);
    tick(300);
    expect(searchSpy).toHaveBeenCalledTimes(1);
  }));

  it('should display multiple heroes on search', fakeAsync(() => {
    fixture.detectChanges();

    let inputBox = fixture.debugElement.query(By.css('#search-box'));
    let inputBoxElement = inputBox.nativeElement;
    // Why does adding this line cause search to be called twice??
    // let heroes;
    // component.heroes$.subscribe(value => {heroes = value});

    inputBoxElement.value = "Test";
    inputBox.triggerEventHandler('keyup', null);

    tick(300);
    expect(searchSpy).toHaveBeenCalledTimes(1);

    //figure out how to test observable property -- see above
    // expect(heroes.length).toBe(2);

    //detect new changes from async pipe on ngFor
    fixture.detectChanges();
    let foundHeroes = fixture.debugElement.queryAll(By.css('li'));
    expect(foundHeroes.length).toBe(2);

    foundHeroes.forEach((heroItem, index) => {
      let heroLink = heroItem.query(By.css('a')).nativeElement;
      expect(heroLink.getAttribute('ng-reflect-router-link')).toBe(`/detail/${testResultArray[index].id}`);
      expect(heroItem.nativeElement.innerText.trim()).toBe(testResultArray[index].name);
    })
  }));
});
