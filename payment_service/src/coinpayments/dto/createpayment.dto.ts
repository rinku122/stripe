import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
  //The amount of the payment in the original currency (currency1 below).
  @IsNotEmpty()
  @IsString()
  amount: string;

  //The original currency of the payment.
  @IsNotEmpty()
  @IsString()
  currency1: string;

  //The currency the buyer will be sending. For example if your products are priced in USD but you are
  //receiving BTC, you would use currency1=USD and currency2=BTC.
  // currency1 and currency2 can be set to the same thing if you don't need currency conversion.
  @IsNotEmpty()
  @IsString()
  currency2: string;

  //Set the buyer's email address. This will let us send them a notice if they underpay or need a refund. We
  //will not add them to our mailing list or spam them or anything like that.
  @IsNotEmpty()
  @IsEmail()
  buyer_email: string;

  //Optionally set the address to send the funds to (if not set will use the settings you have set on the 'Coins Acceptance Settings' page).
  // Remember: this must be an address in currency2's network.
  @IsOptional()
  @IsString()
  address: string;

  //Optionally set the buyer's name for your reference.
  @IsOptional()
  @IsString()
  buyer_name: string;

  //Item name for your reference, will be on the payment information page and in the IPNs for the payment.
  @IsOptional()
  @IsString()
  item_name: string;

  //Item number for your reference, will be on the payment information page and in the IPNs for the payment.
  @IsOptional()
  @IsString()
  item_number: string;

  //Another field for your use, will be on the payment information page and in the IPNs for the payment.
  @IsOptional()
  @IsString()
  invoice: string;

  //Another field for your use, will be on the payment information page and in the IPNs for the payment.
  @IsOptional()
  @IsString()
  custom: string;
}
