import { GeneralModel } from "./general.model";

export class TruckModel extends GeneralModel{
    id: number;
	createdWhen:	Date;
	createdBy: number;
	modifiedWhen: Date;
	modifiedBy: number;
	isEnabled: boolean;
	concurrencyStamp: string;
	code: string;
	name: string;
	truckNumber: string;
	payLoad: number;
	loadLimit: number;
	truckRentalId: number;
	truckRentalName: string;
	truckOwnershipId: number;
	truckOwnershipName: string;
	truckTypeId: number;
	truckTypeName: string;
	address?: string;
	phoneNumber?: string;
	length: number;
	width: number;
	height: number;
}
