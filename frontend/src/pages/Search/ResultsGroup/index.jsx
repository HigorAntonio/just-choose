import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';

import {
  Container,
  Header,
  Title,
  Main,
  Footer,
  BottomLineWrapper,
  BottomLine,
  BottomLineButtonWrapper,
  BottomLineButton,
  BottomLineButtonLabel,
  BottomLineIconWrapper,
  BottomLineIcon,
  BottomLineTextWrapper,
  BottomLineText,
} from './styles';

const ResultsGroup = ({ title = '', content, renderInMain, path }) => {
  const history = useHistory();

  const [showMoreButtonText, setShowMoreButtonText] = useState(
    `Mostrar mais ${title.toLowerCase()}`
  );
  const [titleSufix, setTitleSufix] = useState(
    title.substring(title.length - 2, title.length)
  );
  const [results, setResults] = useState([]);

  useEffect(() => {
    setTitleSufix(title.substring(title.length - 2, title.length));
  }, [title]);

  useEffect(() => {
    if (content && content.results) {
      setResults(content.results.slice(0, 5));
      setShowMoreButtonText(
        content.results.length - 5 > 0
          ? `Mostrar mais ${content.results.length - 5} ${title.toLowerCase()}`
          : ''
      );
    }
  }, [content, title]);

  const handleShowMore = () => {
    if (
      showMoreButtonText ===
      `Mostrar tod${titleSufix === 'is' ? 'o' : 'a'}s ${
        titleSufix === 'is' ? 'o' : 'a'
      }s ${title.toLowerCase()}`
    ) {
      history.push(path);
    } else {
      if (content && content.results) {
        setResults(content.results);
      }
      if (content.total_results > 10) {
        setShowMoreButtonText(
          `Mostrar tod${titleSufix === 'is' ? 'o' : 'a'}s ${
            titleSufix === 'is' ? 'o' : 'a'
          }s ${title.toLowerCase()}`
        );
      } else {
        setShowMoreButtonText('');
      }
    }
  };

  return (
    <Container>
      <Header>
        <Title>{title}</Title>
      </Header>
      <Main>{renderInMain(results)}</Main>
      <Footer>
        <BottomLineWrapper>
          <BottomLine />
          {showMoreButtonText && (
            <>
              <BottomLineButtonWrapper>
                <BottomLineButton onClick={handleShowMore}>
                  <BottomLineButtonLabel>
                    <BottomLineIconWrapper>
                      <BottomLineTextWrapper>
                        <BottomLineText>{showMoreButtonText}</BottomLineText>
                      </BottomLineTextWrapper>
                      <BottomLineIcon>
                        <FaChevronDown />
                      </BottomLineIcon>
                    </BottomLineIconWrapper>
                  </BottomLineButtonLabel>
                </BottomLineButton>
              </BottomLineButtonWrapper>
              <BottomLine />
            </>
          )}
        </BottomLineWrapper>
      </Footer>
    </Container>
  );
};

export default ResultsGroup;
