import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Lookup from '@/models/Lookup';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        await connectDB();
        const lookup = await Lookup.findById(id);

        if (!lookup) {
            console.error(`Lookup not found for ID: ${id}`);
            return NextResponse.json({ message: 'Not found' }, { status: 404 });
        }

        // Check ownership
        const userId = (session.user as any).id;
        console.log(`Checking ownership: lookup.userId=${lookup.userId.toString()}, session.userId=${userId}`);

        if (lookup.userId.toString() !== userId) {
            console.error(`Ownership mismatch: ${lookup.userId.toString()} !== ${userId}`);
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json(lookup);
    } catch (error) {
        console.error('API Error in [id] route:', error);
        return NextResponse.json({ message: 'Internal error' }, { status: 500 });
    }
}
