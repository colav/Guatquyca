"use client";

/* Next */
import Link from "next/link";

/* UI Library Components */
import { Button, Card, Col, Row, Tag, Typography } from "antd";

/**
 * Cards of the observatories list. Texts are provisional (pending approval of Luis).
 *
 * @param {{ key: string, title: string, description: string, href: string }[]} observatories
 */
export function ObservatoryList({ observatories }) {
  return (
    <Row gutter={[16, 16]}>
      {observatories.map((o) => (
        <Col key={o.key} xs={24} md={12} lg={8}>
          <Card title={o.title} actions={[<Link key="open" href={o.href}><Button type="primary">Abrir observatorio</Button></Link>]}>
            <Typography.Paragraph>{o.description}</Typography.Paragraph>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

/**
 * Cards of the boards of an observatory; the ones without `href` are "próximamente".
 *
 * @param {{ key: string, title: string, description: string, href?: string }[]} boards
 */
export function BoardList({ boards }) {
  return (
    <Row gutter={[16, 16]}>
      {boards.map((b) => (
        <Col key={b.key} xs={24} md={12} lg={8}>
          <Card
            title={b.title}
            extra={b.href ? null : <Tag>Próximamente</Tag>}
            style={b.href ? undefined : { opacity: 0.7 }}
            actions={b.href ? [<Link key="open" href={b.href}><Button type="primary">Abrir tablero</Button></Link>] : []}
          >
            <Typography.Paragraph>{b.description}</Typography.Paragraph>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
