import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Log{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    timestamp: string

    @Column()
    label: string

    @Column()
    message: string

    @Column({type: "json", nullable: true})
    data
}