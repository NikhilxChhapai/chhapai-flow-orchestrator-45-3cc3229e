
// Mock implementation of Firebase Timestamp
export class MockTimestamp {
  private seconds: number;
  private nanoseconds: number;
  
  constructor(seconds: number, nanoseconds: number = 0) {
    this.seconds = seconds;
    this.nanoseconds = nanoseconds;
  }

  static now(): MockTimestamp {
    const now = Date.now();
    const seconds = Math.floor(now / 1000);
    const nanoseconds = (now % 1000) * 1000000;
    return new MockTimestamp(seconds, nanoseconds);
  }

  static fromDate(date: Date): MockTimestamp {
    const seconds = Math.floor(date.getTime() / 1000);
    const nanoseconds = (date.getTime() % 1000) * 1000000;
    return new MockTimestamp(seconds, nanoseconds);
  }

  toDate(): Date {
    return new Date(this.seconds * 1000 + this.nanoseconds / 1000000);
  }

  toString(): string {
    return this.toDate().toString();
  }
}

// Type alias to maintain compatibility with Firebase imports
export type Timestamp = MockTimestamp;

export default MockTimestamp;
