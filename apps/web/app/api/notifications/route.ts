import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    notifications: [
      {
        id: 'n1',
        title: 'Review required',
        body: 'Mobile cart visual diff on fix/checkout-css',
        link: '/review/res_fail_cart_mobile',
        read_at: null,
      },
    ],
  })
}
