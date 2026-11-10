"use client";

/* Next */
import Link from "next/link";

/* UI Library Components */
import { Button, Card, Col, Row, Tag, Typography } from "antd";

/**
 * Cards of the observatories list (texts of F121, approved in D-263). Each card can list its boards as direct links.
 *
 * @param {{ key: string, title: string, tag?: string, description: string, href: string, boards?: { key: string, title: string, description: string, href: string }[], footnote?: string }[]} observatories
 */
export function ObservatoryList({ observatories }) {
  return (
    <Row gutter={[16, 16]}>
      {observatories.map((o) => (
        <Col key={o.key} xs={24} lg={16} xl={12}>
          <Card
            title={<>{o.title} {o.tag ? <Tag style={{ marginInlineStart: 4, fontWeight: 400 }}>{o.tag}</Tag> : null}</>}
            styles={{ title: { whiteSpace: "normal" } }}
            actions={[<Link key="open" href={o.href}><Button type="primary">Abrir observatorio</Button></Link>]}
          >
            <Typography.Paragraph>{o.description}</Typography.Paragraph>
            {o.boards ? (
              <nav aria-label={`Tableros de ${o.title}`}>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  {o.boards.map((b) => (
                    <li key={b.key}>
                      <Link
                        href={b.href}
                        data-testid={`board-link-${b.key}`}
                        style={{ display: "block", padding: "8px 12px", border: "1px solid rgba(5,5,5,.1)", borderRadius: 8, color: "inherit" }}
                      >
                        <Typography.Text strong style={{ display: "block" }}>{b.title}</Typography.Text>
                        <Typography.Text type="secondary">{b.description}</Typography.Text>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
            {o.footnote ? <Typography.Paragraph type="secondary" style={{ fontSize: 12, marginTop: 12, marginBottom: 0 }}>{o.footnote}</Typography.Paragraph> : null}
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
