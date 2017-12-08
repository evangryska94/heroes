import { async, inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { HttpClientModule, HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Observable } from 'rxjs/Observable';

import { Hero } from './hero';
import { HeroService } from './hero.service';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';

describe('HeroService', () => {

    let messageService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ HttpClientModule, HttpClientTestingModule ],
            providers: [ HeroService, MessageService ]
          }).compileComponents();
    }));

    beforeEach(() => {
        messageService = TestBed.get(MessageService);
    });

    it('should create hero service using injected service successfully', inject([HeroService], (service: HeroService) => {
        expect(service instanceof HeroService).toBe(true);
    }));

    it('should succesfully create "new" hero service with injected HttpClient', inject([HttpClient], (httpClient: HttpClient) => {
        expect(httpClient).not.toBeNull();
        let service = new HeroService(httpClient, messageService);
        expect(service instanceof HeroService).toBe(true);
    }));

    describe('GET requests', () => {
        let backend: HttpTestingController;
        let heroService: HeroService;
        let spy;

        beforeEach(inject([HttpClient, HttpTestingController], (httpClient: HttpClient, mockBackend: HttpTestingController) => {
            backend = mockBackend;
            heroService = new HeroService(httpClient, messageService);

            spy = spyOn(messageService, 'add').and.stub();
        }));

        afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
            backend.verify();
        }));

        it('getHeroes should send request to get all heroes', async() => {
            heroService.getHeroes().subscribe();

            backend.expectOne((request: HttpRequest<any>) => {
                return request.url === 'api/heroes'
                    && request.method === 'GET';
            });
        });

        it('getHeroes should return all heroes retrieved', async() => {
            heroService.getHeroes().subscribe((result) => {
                expect(result.length).toBe(HEROES.length);
                expect(result).toBe(HEROES);
                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).toHaveBeenCalledWith('HeroService: fetched heroes');
            });

            backend.expectOne('api/heroes').flush(HEROES)
        });

        it('getHeroes should handle error', async() => {
            heroService.getHeroes().subscribe((result) => {
                expect(result).toEqual([]);
                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).toHaveBeenCalledWith('HeroService: getHeroes failed: Http failure response for api/heroes: 0 ');
            });

            backend.expectOne('api/heroes').error(new ErrorEvent('test error'));
        });

        it('getHeroNo404 should send request to get a hero', async() => {
            let id = 11;
            heroService.getHeroNo404(id).subscribe();

            backend.expectOne((request: HttpRequest<any>) => {
                return request.url === `api/heroes/?id=${id}`
                    && request.method === 'GET';
            });
        });

        it('getHeroNo404 should return the found hero', async() => {
            let id = 11;
            heroService.getHeroNo404(id).subscribe((result) => {
                expect(result).toBe(HEROES[0]);
                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).toHaveBeenCalledWith(`HeroService: fetched hero id=${id}`);
            });

            backend.expectOne(`api/heroes/?id=${id}`).flush([HEROES[0]])
        });

        it('getHeroNo404 should return undefined if no hero found', async() => {
            let id = 11;
            heroService.getHeroNo404(id).subscribe((result) => {
                expect(result).toBe(undefined);
                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).toHaveBeenCalledWith(`HeroService: did not find hero id=${id}`);
            });

            backend.expectOne(`api/heroes/?id=${id}`).flush([])
        });

        it('getHeroNo404 should handle error', async() => {
            let id = 11;
            heroService.getHeroNo404(id).subscribe((result) => {
                expect(result).toEqual(undefined);
                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).toHaveBeenCalledWith(`HeroService: getHero id=${id} failed: Http failure response for api/heroes/?id=${id}: 0 `);
            });

            backend.expectOne(`api/heroes/?id=${id}`).error(new ErrorEvent('test error'));
        });

        it('getHero should send request to get a hero', async() => {
            let id = 11;
            heroService.getHero(id).subscribe();

            backend.expectOne((request: HttpRequest<any>) => {
                return request.url === `api/heroes/${id}`
                    && request.method === 'GET';
            });
        });

        it('getHero should return the found hero', async() => {
            let id = 11;
            heroService.getHero(id).subscribe((result) => {
                expect(result).toBe(HEROES[0]);
                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).toHaveBeenCalledWith(`HeroService: fetched hero id=${id}`);
            });

            backend.expectOne(`api/heroes/${id}`).flush(HEROES[0])
        });

        it('getHero should handle error', async() => {
            let id = 11;
            heroService.getHero(id).subscribe((result) => {
                expect(result).toEqual(undefined);
                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).toHaveBeenCalledWith(`HeroService: getHero id=${id} failed: Http failure response for api/heroes/${id}: 0 `);
            });

            backend.expectOne(`api/heroes/${id}`).error(new ErrorEvent('test error'));
        });

        it('searchHeroes should send request to find all heroes with a given search term', async() => {
            let searchTerm = 'Mr. Nice';
            heroService.searchHeroes(searchTerm).subscribe();

            backend.expectOne((request: HttpRequest<any>) => {
                return request.url === `api/heroes/?name=${searchTerm}`
                    && request.method === 'GET';
            });
        });

        it('searchHeroes should return the found heroes', async() => {
            let searchTerm = 'Mr. Nice';
            heroService.searchHeroes(searchTerm).subscribe((result) => {
                expect(result).toEqual([HEROES[0]]);
                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).toHaveBeenCalledWith(`HeroService: found heroes matching "${searchTerm}"`);
            });

            backend.expectOne(`api/heroes/?name=${searchTerm}`).flush([HEROES[0]])
        });

        it('searchHeroes should return empty array if no term is searched', () => {
            let searchTerm = ' ';
            heroService.searchHeroes(searchTerm).subscribe((result) => {
                expect(result).toEqual([]);
                expect(spy).not.toHaveBeenCalled();
            });

            backend.expectNone(`api/heroes/?name=${searchTerm}`);
        });

        it('searchHeroes should handle error', async() => {
            let searchTerm = 'Mr. Nice';
            heroService.searchHeroes(searchTerm).subscribe((result) => {
                expect(result).toEqual([]);
                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).toHaveBeenCalledWith(`HeroService: searchHeroes failed: Http failure response for api/heroes/?name=${searchTerm}: 0 `);
            });

            backend.expectOne(`api/heroes/?name=${searchTerm}`).error(new ErrorEvent('test error'));
        });
    });

    describe('POST requests', () => {
        let backend: HttpTestingController;
        let heroService: HeroService;
        let spy;

        beforeEach(inject([HttpClient, HttpTestingController], (httpClient: HttpClient, mockBackend: HttpTestingController) => {
            backend = mockBackend;
            heroService = new HeroService(httpClient, messageService);

            spy = spyOn(messageService, 'add').and.stub();
        }));

        afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
            backend.verify();
        }));

        it('addHero should send request to add a hero', async() => {
            let hero = new Hero(0, 'TestHero');
            heroService.addHero(hero).subscribe();

            backend.expectOne((request: HttpRequest<any>) => {
                return request.url === `api/heroes`
                    && request.method === 'POST'
                    && request.headers.get('Content-type') === 'application/json'
                    && request.body['id'] === 0
                    && request.body['name'] === 'TestHero';
            });
        });

        it('addHero should return the added hero', async() => {
            let hero = new Hero(0, 'TestHero');
            heroService.addHero(hero).subscribe((result) => {
                expect(result).toBe(hero);
                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).toHaveBeenCalledWith(`HeroService: added hero w/ id=${hero.id}`);
            });

            backend.expectOne(`api/heroes`).flush(hero)
        });

        it('addHero should handle error', async() => {
            heroService.addHero(null).subscribe((result) => {
                expect(result).toEqual(undefined);
                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).toHaveBeenCalledWith(`HeroService: addHero failed: Http failure response for api/heroes: 0 `);
            });

            backend.expectOne(`api/heroes`).error(new ErrorEvent('test error'));
        });
    });

    describe('DELETE requests', () => {
        let backend: HttpTestingController;
        let heroService: HeroService;
        let spy;

        beforeEach(inject([HttpClient, HttpTestingController], (httpClient: HttpClient, mockBackend: HttpTestingController) => {
            backend = mockBackend;
            heroService = new HeroService(httpClient, messageService);

            spy = spyOn(messageService, 'add').and.stub();
        }));

        afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
            backend.verify();
        }));

        it('deleteHero should send request to delete a hero when passed a Hero', async() => {
            let hero = HEROES[0];
            heroService.deleteHero(hero).subscribe();

            backend.expectOne((request: HttpRequest<any>) => {
                return request.url === `api/heroes/${hero.id}`
                    && request.method === 'DELETE'
                    && request.headers.get('Content-type') === 'application/json';
            });
        });

        it('deleteHero should send request to delete a hero when passed a number', async() => {
            let hero = HEROES[0].id;
            heroService.deleteHero(hero).subscribe();

            backend.expectOne((request: HttpRequest<any>) => {
                return request.url === `api/heroes/${hero}`
                    && request.method === 'DELETE'
                    && request.headers.get('Content-type') === 'application/json';
            });
        });

        it('deleteHero should return the deleted hero', async() => {
            let hero = HEROES[0];
            heroService.deleteHero(hero).subscribe((result) => {
                expect(result).toBe(hero);
                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).toHaveBeenCalledWith(`HeroService: deleted hero id=${hero.id}`);
            });

            backend.expectOne(`api/heroes/${hero.id}`).flush(hero)
        });

        it('deleteHero should handle error', async() => {
            let hero = 0;
            heroService.deleteHero(hero).subscribe((result) => {
                expect(result).toEqual(undefined);
                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).toHaveBeenCalledWith(`HeroService: deleteHero failed: Http failure response for api/heroes/${hero}: 0 `);
            });

            backend.expectOne(`api/heroes/${hero}`).error(new ErrorEvent('test error'));
        });
    });

    describe('PUT requests', () => {
        let backend: HttpTestingController;
        let heroService: HeroService;
        let spy;

        beforeEach(inject([HttpClient, HttpTestingController], (httpClient: HttpClient, mockBackend: HttpTestingController) => {
            backend = mockBackend;
            heroService = new HeroService(httpClient, messageService);

            spy = spyOn(messageService, 'add').and.stub();
        }));

        afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
            backend.verify();
        }));

        it('updateHero should send request to update a hero', async() => {
            let hero = new Hero(11, 'Mr. Mean');
            heroService.updateHero(hero).subscribe();

            backend.expectOne((request: HttpRequest<any>) => {
                return request.url === `api/heroes`
                    && request.method === 'PUT'
                    && request.headers.get('Content-type') === 'application/json'
                    && request.body['id'] === 11
                    && request.body['name'] === 'Mr. Mean';
            });
        });

        it('updateHero should return the updated hero', async() => {
            let hero = new Hero(11, 'Mr. Mean');
            heroService.updateHero(hero).subscribe((result) => {
                expect(result).toBe(hero);
                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).toHaveBeenCalledWith(`HeroService: updated hero id=${hero.id}`);
            });

            backend.expectOne(`api/heroes`).flush(hero)
        });

        it('updateHero should handle error', async() => {
            heroService.updateHero(null).subscribe((result) => {
                expect(result).toEqual(undefined);
                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).toHaveBeenCalledWith(`HeroService: updateHero failed: Http failure response for api/heroes: 0 `);
            });

            backend.expectOne(`api/heroes`).error(new ErrorEvent('test error'));
        });
    });
});