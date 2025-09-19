import {NextRequest, NextResponse} from 'next/server';
import {prisma} from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const {name, email} = await req.json();
        if (!email) {
            return NextResponse.json({error: 'Email is required'}, {status: 400});
        }
        const employee = await prisma.employee.create({
            data: {name, email},
        });
        return NextResponse.json(employee, {status: 201});
    } catch (error: unknown) {
        return NextResponse.json({error: error instanceof Error ? error.message : 'Failed to create employee'}, {status: 500});
    }
}

export async function GET() {
    try {
        const employees = await prisma.employee.findMany({orderBy: {createdAt: 'desc'}});
        return NextResponse.json(employees);
    } catch (error: unknown) {
        return NextResponse.json({error: error instanceof Error ? error.message : 'Failed to fetch employees'}, {status: 500});
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const {id, name, email} = await req.json();
        if (!id) return NextResponse.json({error: 'Employee id is required'}, {status: 400});
        if (!email) return NextResponse.json({error: 'Email is required'}, {status: 400});
        const employee = await prisma.employee.update({
            where: {id},
            data: {name, email},
        });
        return NextResponse.json(employee);
    } catch (error: unknown) {
        return NextResponse.json({error: error instanceof Error ? error.message : 'Failed to update employee'}, {status: 500});
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const {id} = await req.json();
        if (!id) return NextResponse.json({error: 'Employee id is required'}, {status: 400});
        await prisma.employee.delete({where: {id}});
        return NextResponse.json({success: true});
    } catch (error: unknown) {
        return NextResponse.json({error: error instanceof Error ? error.message : 'Failed to delete employee'}, {status: 500});
    }
} 