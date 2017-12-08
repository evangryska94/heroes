import { async, inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { HttpClientModule, HttpClient, HttpXhrBackend, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { Hero } from './hero';
import { HeroService } from './hero.service';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';

describe('HeroService', () => {

    let messageService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ HttpClientModule ],
            providers: [ HeroService, MessageService,
              { provide: HttpXhrBackend, useClass: MockBackend }
            ]
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

    it('should provide the MockBackend as the injected HttpXhrBackend', inject([HttpXhrBackend], (backend: MockBackend) => {
        expect(backend).not.toBeNull('backend should be provided');
    }));
});