import { TestBed } from '@angular/core/testing';
import { SpeechInputService } from './speech-input.service';

describe('SpeechInputService', () => {
  it('reports unsupported when SpeechRecognition is missing', () => {
    TestBed.configureTestingModule({
      providers: [SpeechInputService],
    });
    const service = TestBed.inject(SpeechInputService);
    expect(service.isSupported()).toBe(false);
    service.startListening();
    expect(service.status()).toBe('unsupported');
  });
});
