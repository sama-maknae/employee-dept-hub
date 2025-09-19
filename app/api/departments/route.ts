import {NextRequest, NextResponse} from 'next/server';
import {prisma} from '@/lib/prisma'
import {Prisma} from '@/generated/prisma'

export async function POST(req: NextRequest) {
    try {
        const {title, description} = await req.json();
        if (!title) {
            return NextResponse.json({error: 'Title is required'}, {status: 400});
        }

        const department = await prisma.department.create({
            data: {
                title,
                description,
            } as Prisma.DepartmentCreateInput,
        });
        return NextResponse.json(department, {status: 201});
    } catch (error: unknown) {
        return NextResponse.json({error: error instanceof Error ? error.message : 'Failed to create department'}, {status: 500});
    }
}

export async function GET() {
    try {
        const departments = await prisma.department.findMany({
            orderBy: {createdAt: 'desc'},
            include: {
                _count: {
                    select: {employee: true}
                }
            }
        });
        return NextResponse.json(departments);
    } catch (error: unknown) {
        return NextResponse.json({error: error instanceof Error ? error.message : 'Failed to fetch departments'}, {status: 500});
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const {id, title, description} = await req.json();
        if (!id) return NextResponse.json({error: 'Department id is required'}, {status: 400});
        if (!title) return NextResponse.json({error: 'Title is required'}, {status: 400});

        const department = await prisma.department.update({
            where: {id},
            data: {
                title,
                description,
            } as Prisma.DepartmentUpdateInput,
        });
        return NextResponse.json(department);
    } catch (error: unknown) {
        return NextResponse.json({error: error instanceof Error ? error.message : 'Failed to update department'}, {status: 500});
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const {id} = await req.json();
        if (!id) return NextResponse.json({error: 'Department id is required'}, {status: 400});
        await prisma.department.delete({where: {id}});
        return NextResponse.json({success: true});
    } catch (error: unknown) {
        return NextResponse.json({error: error instanceof Error ? error.message : 'Failed to delete department'}, {status: 500});
    }
}