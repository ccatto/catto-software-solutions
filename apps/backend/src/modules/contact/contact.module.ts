import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactResolver } from './contact.resolver';

// CattoSmsModule (registered in AppModule) is global, so CattoSmsService is
// injectable here without re-importing. ConfigModule is global too.
@Module({
  providers: [ContactService, ContactResolver],
})
export class ContactModule {}
