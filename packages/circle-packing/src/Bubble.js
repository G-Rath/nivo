import React from 'react'
import { TransitionMotion, spring } from 'react-motion'
import pick from 'lodash/pick'
import { LegacyContainer, SvgWrapper } from '@nivo/core'
import { interpolateColor, getInterpolatedColor } from '@nivo/colors'
import enhance from './enhance'
import { nodeWillEnter, nodeWillLeave } from './motion'
import { getNodeHandlers } from './interactivity'

const Bubble = ({
    nodes,
    nodeComponent,

    margin,
    outerWidth,
    outerHeight,

    theme,
    borderWidth,
    getBorderColor,
    defs,

    getLabelTextColor,

    animate,
    motionStiffness,
    motionDamping,

    isInteractive,
    onClick,
    tooltipFormat,
    tooltip,
    isZoomable,
    zoomToNode,
    role,
}) => {
    const springConfig = {
        stiffness: motionStiffness,
        damping: motionDamping,
    }

    const getHandlers = (node, showTooltip, hideTooltip) =>
        getNodeHandlers(node, {
            isInteractive,
            onClick,
            showTooltip,
            hideTooltip,
            isZoomable,
            zoomToNode,
            theme,
            tooltipFormat,
            tooltip,
        })

    return (
        <LegacyContainer
            isInteractive={isInteractive}
            theme={theme}
            animate={animate}
            motionStiffness={motionStiffness}
            motionDamping={motionDamping}
        >
            {({ showTooltip, hideTooltip }) => (
                <SvgWrapper
                    width={outerWidth}
                    height={outerHeight}
                    margin={margin}
                    defs={defs}
                    theme={theme}
                    role={role}
                >
                    {!animate && (
                        <g>
                            {nodes.map(node =>
                                React.createElement(nodeComponent, {
                                    key: node.path,
                                    node,
                                    style: {
                                        ...pick(node, ['scale', 'r', 'x', 'y', 'color']),
                                        fill: node.fill,
                                        borderWidth,
                                        borderColor: getBorderColor(node),
                                        labelTextColor: getLabelTextColor(node),
                                    },
                                    handlers: getHandlers(node, showTooltip, hideTooltip),
                                    theme,
                                })
                            )}
                        </g>
                    )}
                    {animate && (
                        <TransitionMotion
                            willEnter={nodeWillEnter}
                            willLeave={nodeWillLeave(springConfig)}
                            styles={nodes.map(node => ({
                                key: node.path,
                                data: node,
                                style: {
                                    scale: spring(1, springConfig),
                                    r: spring(node.r, springConfig),
                                    x: spring(node.x, springConfig),
                                    y: spring(node.y, springConfig),
                                    opacity: spring(1, springConfig),
                                    ...interpolateColor(node.color, springConfig),
                                },
                            }))}
                        >
                            {interpolatedStyles => (
                                <g>
                                    {interpolatedStyles.map(({ style, data: node }) => {
                                        style.color = getInterpolatedColor(style)

                                        return React.createElement(nodeComponent, {
                                            key: node.path,
                                            node,
                                            style: {
                                                ...style,
                                                fill: node.fill,
                                                borderWidth,
                                                borderColor: getBorderColor(style),
                                                labelTextColor: getLabelTextColor(style),
                                            },
                                            handlers: getHandlers(node, showTooltip, hideTooltip),
                                            theme,
                                        })
                                    })}
                                </g>
                            )}
                        </TransitionMotion>
                    )}
                </SvgWrapper>
            )}
        </LegacyContainer>
    )
}

Bubble.displayName = 'Bubble'

const enhancedBubble = enhance(Bubble)
enhancedBubble.displayName = 'Bubble'

export default enhancedBubble
