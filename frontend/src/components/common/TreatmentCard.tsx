import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  type LucideIcon, 
  Stethoscope, 
  TestTubes, 
  ThumbsUp, 
  TriangleAlert, 
  BadgeCheck 
} from 'lucide-react';
import type { TreatmentDetail } from '../../constants/treatment';

interface GradientColors {
  primary: string;
  secondary: string;
  glow?: string;
}

interface TreatmentCardProps {
  title: string;
  description: string;
  details: TreatmentDetail;
  gradient: GradientColors;
  Icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
  tags?: string[];
  layoutId?: string;
}

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const TreatmentCard: React.FC<TreatmentCardProps> = ({
  title,
  description,
  details,
  gradient,
  Icon,
  isActive,
  onClick,
  tags = [],
  layoutId,
}) => {
  return (
    <CardWrapper
      layoutId={layoutId}
      onClick={onClick}
      $gradient={gradient}
      $isActive={isActive}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
    >
      <InnerContent $isActive={isActive}>
        {/* Animated Border pseudo-element handled in styled-components */}
        <ContentContainer>
          <Header>
            <IconWrapper $gradient={gradient} layoutId={`icon-${layoutId}`}>
              <Icon size={isActive ? 28 : 24} />
            </IconWrapper>
            <TitleContainer>
              <Title layoutId={`title-${layoutId}`}>{title}</Title>
              {tags.length > 0 && !isActive && (
                <TagGroup>
                  {tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </TagGroup>
              )}
            </TitleContainer>
            <ActionIcon $isActive={isActive}>
              <ChevronDown size={20} />
            </ActionIcon>
          </Header>

          <Description $isActive={isActive}>{description}</Description>

          <AnimatePresence>
            {isActive && (
              <DetailsSection
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              >
                <Divider />
                <Grid>
                  {Object.entries(SECTION_CONFIG).map(([key, config]) => {
                    const items = details[key as keyof TreatmentDetail];
                    if (!items || items.length === 0) return null;
                    const DetailIcon = config.icon;

                    return (
                      <DetailCard key={key}>
                        <DetailHeader>
                          <DetailIcon size={16} />
                          <span>{config.label}</span>
                        </DetailHeader>
                        <ItemList>
                          {items.map((item, idx) => (
                            <Item key={idx}>
                              <Dot $color={gradient.primary} />
                              {item}
                            </Item>
                          ))}
                        </ItemList>
                      </DetailCard>
                    );
                  })}
                </Grid>
              </DetailsSection>
            )}
          </AnimatePresence>
        </ContentContainer>
      </InnerContent>
    </CardWrapper>
  );
};

// --- Styled Components ---

const CardWrapper = styled(motion.div)<{ $gradient: GradientColors; $isActive: boolean }>`
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(12px);
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  
  /* Performance optimization: transition shadow separately */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 0 20px ${(props) => props.$gradient.glow || props.$gradient.primary}33;
    border-color: rgba(255, 255, 255, 0.1);
  }

  /* Rotating Border Animation */
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(
      transparent,
      ${(props) => props.$gradient.primary},
      ${(props) => props.$gradient.secondary},
      transparent 30%
    );
    animation: ${rotate} 4s linear infinite;
    animation-play-state: ${(props) => (props.$isActive ? 'running' : 'paused')};
    opacity: ${(props) => (props.$isActive ? 0.6 : 0)};
    transition: opacity 0.5s ease;
    z-index: 0;
    pointer-events: none;
  }

  &:hover::before {
    opacity: 0.4;
    animation-play-state: running;
  }

  ${(props) =>
    props.$isActive &&
    css`
      grid-column: 1 / -1;
      border-color: rgba(255, 255, 255, 0.15);
      background: rgba(15, 23, 42, 0.8);
    `}
`;

const InnerContent = styled.div<{ $isActive: boolean }>`
  position: relative;
  z-index: 1;
  margin: 1.5px; /* Creates the border width */
  background: #0f172a;
  border-radius: 22px;
  height: 100%;
  padding: ${(props) => (props.$isActive ? '32px' : '24px')};
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconWrapper = styled(motion.div)<{ $gradient: GradientColors }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: ${(props) => `linear-gradient(135deg, ${props.$gradient.primary}15, ${props.$gradient.secondary}15)`};
  color: ${(props) => props.$gradient.primary};
  border: 1px solid ${(props) => props.$gradient.primary}33;
  flex-shrink: 0;
`;

const TitleContainer = styled.div`
  flex-grow: 1;
`;

const Title = styled(motion.h3)`
  font-size: 1.125rem;
  font-weight: 700;
  color: #f8fafc;
  margin: 0;
`;

const TagGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 4px;
`;

const Tag = styled.span`
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(148, 163, 184, 0.8);
  padding: 2px 6px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 4px;
`;

const ActionIcon = styled.div<{ $isActive: boolean }>`
  color: #64748b;
  transition: transform 0.3s ease;
  transform: ${(props) => (props.$isActive ? 'rotate(180deg)' : 'rotate(0deg)')};
`;

const Description = styled.p<{ $isActive: boolean }>`
  font-size: 0.875rem;
  line-height: 1.6;
  color: #94a3b8;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: ${(props) => (props.$isActive ? 'none' : '2')};
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const DetailsSection = styled(motion.div)`
  margin-top: 8px;
  overflow: hidden;
`;

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0));
  margin-bottom: 24px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const DetailCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 16px;
  height: 100%;
`;

const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #94a3b8;
  
  span {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

const ItemList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Item = styled.li`
  font-size: 0.875rem;
  color: #cbd5e1;
  display: flex;
  gap: 8px;
  line-height: 1.5;
`;

const Dot = styled.span<{ $color: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${(props) => props.$color};
  margin-top: 6px;
  flex-shrink: 0;
  opacity: 0.6;
`;



const SECTION_CONFIG = {
  treatments: { label: 'Treatments', icon: Stethoscope },
  medicines: { label: 'Medicines', icon: TestTubes },
  benefits: { label: 'Benefits', icon: ThumbsUp },
  risks: { label: 'Risks', icon: TriangleAlert },
  whenToPrefer: { label: 'When to Prefer', icon: BadgeCheck },
};

export default TreatmentCard;
