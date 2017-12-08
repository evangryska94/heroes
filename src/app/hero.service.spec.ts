import { async, inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { HttpClientModule, HttpClient, HttpResponse, HttpRequest } from '@angular/common/http';
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
        let response;
        let spy;

        beforeEach(inject([HttpClient, HttpTestingController], (httpClient: HttpClient, mockBackend: HttpTestingController) => {
            backend = mockBackend;
            heroService = new HeroService(httpClient, messageService);

            spy = spyOn(messageService, 'add').and.stub();
        }));

        afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
            backend.verify();
        }));

        it('should send request to get all heroes', async() => {
            heroService.getHeroes().subscribe();

            backend.expectOne((request: HttpRequest<any>) => {
                return request.url === 'api/heroes'
                    && request.method === 'GET';
            });
        });

        it('should return all heroes retrieved', async() => {
            heroService.getHeroes().subscribe((result) => {
                expect(result.length).toBe(HEROES.length);
                expect(result).toBe(HEROES);
                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).toHaveBeenCalledWith('HeroService: fetched heroes');
            });

            backend.expectOne('api/heroes').flush(HEROES)
        });

        it('should handle error', async() => {
            heroService.getHeroes().subscribe((result) => {
                console.log(result);
                expect(result).toEqual([]);
                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).toHaveBeenCalledWith('HeroService: getHeroes failed: Http failure response for api/heroes: 0 ');
            });

            backend.expectOne('api/heroes').error(new ErrorEvent('test error'));
        });

    });
});