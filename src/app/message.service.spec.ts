import { TestBed, inject } from '@angular/core/testing';

import { MessageService } from './message.service';

describe('MessageService', () => {

  let messageService: MessageService;

  beforeEach(() => {
    messageService = new MessageService();
  });

  it('should create Message Service', () => {
    expect(messageService).toBeTruthy();
    expect(messageService.messages).toEqual(jasmine.any(Array));
    expect(messageService.messages.length).toBe(0);
  });

  it('should add a message to messages array', () => {
    expect(messageService.messages.length).toBe(0);

    let message = "test message";
    messageService.add(message);

    expect(messageService.messages.length).toBe(1);
    expect(messageService.messages[0]).toBe(message);
  });

  it('should clear all messages from messages array', () => {
    messageService.messages = ["test message 1", "test message 2"];
    expect(messageService.messages.length).toBe(2);

    messageService.clear();

    expect(messageService.messages.length).toBe(0);
  });
});
