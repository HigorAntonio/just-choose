import React from 'react';
import { FaHashtag } from 'react-icons/fa';

import formatCount from '../../../utils/formatCount';
import contentTypes from '../../../utils/contentTypes';
import ContentCardSimple from '../../../components/ContentCardSimple';

import { Container, Header, Body } from './styles';

const Result = ({ error, content, lastElementRef }) => {
  const handleContentEnterKey = (e, href) => {
    if (e.key === 'Enter') {
      window.open(href);
    }
  };

  return (
    <Container>
      <Header>
        <div className="headerPosition">
          <h2>
            <FaHashtag
              size={'2rem'}
              style={{ flexShrink: 0, margin: '0 0.5rem' }}
            />
          </h2>
        </div>
        <div className="headerTitle">
          <h2>Título</h2>
        </div>
        <div className="headerVotes">
          <h2>Votos</h2>
        </div>
      </Header>
      <Body>
        {!error &&
          content.length > 0 &&
          content.map((c, i) => {
            const wrapperProps =
              content.length === i + 1
                ? {
                    ref: lastElementRef,
                  }
                : {};
            const href = `${contentTypes.getBaseUrl(c.type)}/${
              c.content_platform_id
            }`;
            const votes = formatCount(c.votes);
            return (
              <div
                className="row"
                key={c.type + c.content_id}
                onClick={() => {
                  window.open(href);
                }}
                {...wrapperProps}
              >
                <div className="bodyPosition">{i + 1}</div>
                <div
                  className="bodyTitle"
                  onKeyPress={(e) => handleContentEnterKey(e, href)}
                  tabIndex="0"
                >
                  <div className="posterWrapper">
                    <ContentCardSimple
                      src={contentTypes.getPosterUrl(c)}
                      title={c.title}
                    />
                  </div>
                  <div className="titleWrapper">
                    <div className="titleText">{c.title}</div>
                  </div>
                </div>
                <div
                  className="bodyVotes"
                  title={c.votes !== votes ? c.votes : ''}
                >
                  {votes}
                </div>
              </div>
            );
          })}
      </Body>
    </Container>
  );
};

export default Result;
