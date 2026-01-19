CREATE TABLE `accommodations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`universityId` int NOT NULL,
	`campusId` int,
	`typeEn` varchar(100) NOT NULL,
	`typeZh` varchar(100) NOT NULL,
	`descriptionEn` text,
	`descriptionZh` text,
	`priceMin` decimal(10,2) NOT NULL,
	`priceMax` decimal(10,2) NOT NULL,
	`priceCurrency` varchar(3) DEFAULT 'EUR',
	`priceUnit` varchar(20) DEFAULT 'month',
	`priceMinRMB` decimal(10,2),
	`priceMaxRMB` decimal(10,2),
	`facilities` text,
	`websiteUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `accommodations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `campuses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`universityId` int NOT NULL,
	`nameEn` varchar(255) NOT NULL,
	`nameZh` varchar(255) NOT NULL,
	`cityId` int NOT NULL,
	`address` text,
	`latitude` decimal(10,7),
	`longitude` decimal(10,7),
	`isMainCampus` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `campuses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`countryId` int NOT NULL,
	`nameEn` varchar(255) NOT NULL,
	`nameZh` varchar(255) NOT NULL,
	`region` varchar(255),
	`latitude` decimal(10,7),
	`longitude` decimal(10,7),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `countries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(3) NOT NULL,
	`nameEn` varchar(255) NOT NULL,
	`nameZh` varchar(255) NOT NULL,
	`isEU` boolean NOT NULL DEFAULT false,
	`isSchengen` boolean NOT NULL DEFAULT false,
	`currency` varchar(3) NOT NULL,
	`officialLanguages` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `countries_id` PRIMARY KEY(`id`),
	CONSTRAINT `countries_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `country_policies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`countryId` int NOT NULL,
	`category` enum('cost_of_living','tourism','study','residence','work','green_card') NOT NULL,
	`titleEn` varchar(255) NOT NULL,
	`titleZh` varchar(255) NOT NULL,
	`contentEn` text NOT NULL,
	`contentZh` text NOT NULL,
	`officialUrl` varchar(500),
	`lastUpdated` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `country_policies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `degree_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(20) NOT NULL,
	`nameEn` varchar(100) NOT NULL,
	`nameZh` varchar(100) NOT NULL,
	`level` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `degree_types_id` PRIMARY KEY(`id`),
	CONSTRAINT `degree_types_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `exchange_rates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fromCurrency` varchar(3) NOT NULL,
	`toCurrency` varchar(3) NOT NULL DEFAULT 'CNY',
	`rate` decimal(10,6) NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `exchange_rates_id` PRIMARY KEY(`id`),
	CONSTRAINT `currency_pair_idx` UNIQUE(`fromCurrency`,`toCurrency`)
);
--> statement-breakpoint
CREATE TABLE `isced_level1` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(2) NOT NULL,
	`nameEn` varchar(255) NOT NULL,
	`nameZh` varchar(255) NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `isced_level1_id` PRIMARY KEY(`id`),
	CONSTRAINT `isced_level1_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `isced_level2` (
	`id` int AUTO_INCREMENT NOT NULL,
	`level1Id` int NOT NULL,
	`code` varchar(3) NOT NULL,
	`nameEn` varchar(255) NOT NULL,
	`nameZh` varchar(255) NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `isced_level2_id` PRIMARY KEY(`id`),
	CONSTRAINT `isced_level2_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `isced_level3` (
	`id` int AUTO_INCREMENT NOT NULL,
	`level2Id` int NOT NULL,
	`code` varchar(4) NOT NULL,
	`nameEn` varchar(255) NOT NULL,
	`nameZh` varchar(255) NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `isced_level3_id` PRIMARY KEY(`id`),
	CONSTRAINT `isced_level3_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `opportunities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`universityId` int NOT NULL,
	`programId` int,
	`type` enum('internship','student_job','research_assistant') NOT NULL,
	`titleEn` varchar(255) NOT NULL,
	`titleZh` varchar(255) NOT NULL,
	`descriptionEn` text,
	`descriptionZh` text,
	`salary` decimal(10,2),
	`salaryCurrency` varchar(3),
	`salaryUnit` varchar(20),
	`websiteUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `opportunities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `programs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`universityId` int NOT NULL,
	`nameEn` varchar(500) NOT NULL,
	`nameZh` varchar(500) NOT NULL,
	`degreeTypeId` int NOT NULL,
	`iscedLevel1Id` int NOT NULL,
	`iscedLevel2Id` int NOT NULL,
	`iscedLevel3Id` int NOT NULL,
	`tuitionFee` decimal(10,2),
	`tuitionCurrency` varchar(3) DEFAULT 'EUR',
	`tuitionPaymentType` enum('annual','semester') DEFAULT 'annual',
	`tuitionFeeRMB` decimal(10,2),
	`teachingLanguages` text,
	`duration` int,
	`startDate` varchar(50),
	`requirementsEn` text,
	`requirementsZh` text,
	`minGPA` decimal(3,2),
	`languageRequirements` text,
	`programUrl` varchar(500),
	`applicationUrl` varchar(500),
	`descriptionEn` text,
	`descriptionZh` text,
	`highlightsEn` text,
	`highlightsZh` text,
	`applicationDeadline` varchar(100),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `programs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rankings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`universityId` int NOT NULL,
	`rankingType` varchar(50) NOT NULL,
	`rankingCategory` varchar(100) NOT NULL,
	`subjectArea` varchar(255),
	`year` int NOT NULL,
	`rank` int,
	`rankRange` varchar(50),
	`score` decimal(5,2),
	`sourceUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `rankings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scholarships` (
	`id` int AUTO_INCREMENT NOT NULL,
	`universityId` int NOT NULL,
	`programId` int,
	`nameEn` varchar(255) NOT NULL,
	`nameZh` varchar(255) NOT NULL,
	`descriptionEn` text,
	`descriptionZh` text,
	`amount` decimal(10,2),
	`amountCurrency` varchar(3),
	`amountRMB` decimal(10,2),
	`coverage` varchar(100),
	`eligibilityEn` text,
	`eligibilityZh` text,
	`applicationUrl` varchar(500),
	`deadline` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `scholarships_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `universities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nameEn` varchar(500) NOT NULL,
	`nameZh` varchar(500) NOT NULL,
	`abbreviation` varchar(50),
	`countryId` int NOT NULL,
	`mainCityId` int NOT NULL,
	`type` enum('public','private') NOT NULL,
	`foundedYear` int,
	`websiteUrl` varchar(500),
	`wikipediaUrl` varchar(500),
	`logoUrl` varchar(500),
	`descriptionEn` text,
	`descriptionZh` text,
	`studentCount` int,
	`internationalStudentPercent` decimal(5,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `universities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `university_idx` ON `accommodations` (`universityId`);--> statement-breakpoint
CREATE INDEX `university_idx` ON `campuses` (`universityId`);--> statement-breakpoint
CREATE INDEX `city_idx` ON `campuses` (`cityId`);--> statement-breakpoint
CREATE INDEX `country_idx` ON `cities` (`countryId`);--> statement-breakpoint
CREATE INDEX `country_idx` ON `country_policies` (`countryId`);--> statement-breakpoint
CREATE INDEX `category_idx` ON `country_policies` (`category`);--> statement-breakpoint
CREATE INDEX `level1_idx` ON `isced_level2` (`level1Id`);--> statement-breakpoint
CREATE INDEX `level2_idx` ON `isced_level3` (`level2Id`);--> statement-breakpoint
CREATE INDEX `university_idx` ON `opportunities` (`universityId`);--> statement-breakpoint
CREATE INDEX `program_idx` ON `opportunities` (`programId`);--> statement-breakpoint
CREATE INDEX `type_idx` ON `opportunities` (`type`);--> statement-breakpoint
CREATE INDEX `university_idx` ON `programs` (`universityId`);--> statement-breakpoint
CREATE INDEX `degree_idx` ON `programs` (`degreeTypeId`);--> statement-breakpoint
CREATE INDEX `isced1_idx` ON `programs` (`iscedLevel1Id`);--> statement-breakpoint
CREATE INDEX `isced2_idx` ON `programs` (`iscedLevel2Id`);--> statement-breakpoint
CREATE INDEX `isced3_idx` ON `programs` (`iscedLevel3Id`);--> statement-breakpoint
CREATE INDEX `active_idx` ON `programs` (`isActive`);--> statement-breakpoint
CREATE INDEX `university_idx` ON `rankings` (`universityId`);--> statement-breakpoint
CREATE INDEX `type_year_idx` ON `rankings` (`rankingType`,`year`);--> statement-breakpoint
CREATE INDEX `category_idx` ON `rankings` (`rankingCategory`);--> statement-breakpoint
CREATE INDEX `university_idx` ON `scholarships` (`universityId`);--> statement-breakpoint
CREATE INDEX `program_idx` ON `scholarships` (`programId`);--> statement-breakpoint
CREATE INDEX `country_idx` ON `universities` (`countryId`);--> statement-breakpoint
CREATE INDEX `city_idx` ON `universities` (`mainCityId`);--> statement-breakpoint
CREATE INDEX `name_en_idx` ON `universities` (`nameEn`);