import {NextRequest, NextResponse} from 'next/server';
import {prisma} from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const {employeeId, departmentId} = await req.json();
        if (!employeeId || !departmentId) {
            return NextResponse.json({error: 'Employee ID and Department ID are required'}, {status: 400});
        }

        const employee = await prisma.employee.update({
            where: {id: employeeId},
            data: {
                department: {
                    connect: {id: departmentId}
                }
            },
            include: {
                department: true
            }
        });

        return NextResponse.json(employee);
    } catch (error: unknown) {
        if (error instanceof Error && 'code' in error && (error as any).code === 'P2002') {
            return NextResponse.json({error: 'Employee is already enrolled in this department'}, {status: 400});
        }
        return NextResponse.json({error: error instanceof Error ? error.message : 'Failed to assign department'}, {status: 500});
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const {employeeId, departmentId} = await req.json();
        if (!employeeId || !departmentId) {
            return NextResponse.json({error: 'Employee ID and Department ID are required'}, {status: 400});
        }

        const employee = await prisma.employee.update({
            where: {id: employeeId},
            data: {
                department: {
                    disconnect: {id: departmentId}
                }
            },
            include: {
                department: true
            }
        });

        return NextResponse.json(employee);
    } catch (error: unknown) {
        return NextResponse.json({error: error instanceof Error ? error.message : 'Failed to remove departent assignment'}, {status: 500});
    }
}

export async function GET(req: NextRequest) {
    try {
        const {searchParams} = new URL(req.url);
        const employeeId = searchParams.get('employeeId');

        if (employeeId) {
            const employee = await prisma.employee.findUnique({
                where: {id: employeeId},
                include: {
                    department: {
                        orderBy: {title: 'asc'}
                    }
                }
            });

            if (!employee) {
                return NextResponse.json({error: 'Employee not found'}, {status: 404});
            }

            return NextResponse.json(employee.department);
        }

        const employeesWithDepartments = await prisma.employee.findMany({
            include: {
                department: {
                    orderBy: {title: 'asc'}
                }
            },
            orderBy: {createdAt: 'desc'}
        });

        return NextResponse.json(employeesWithDepartments);
    } catch (error: unknown) {
        return NextResponse.json({error: error instanceof Error ? error.message : 'Failed to fetch employee departments'}, {status: 500});
    }
}