import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getSwapById,
  acceptSwap,
  rejectSwap,
  cancelSwap,
  confirmSwap,
  completeSwap
} from '../services/swapService';
import { getMessages, sendMessage } from '../services/messageService';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import StatusBadge from '../components/common/StatusBadge';
import SwapValueCompare from '../components/clothing/SwapValueCompare';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import {
  Send,
  MessageSquare,
  CheckCircle,
  Truck,
  MapPin,
  Clock,
  ArrowLeft,
  CheckCheck,
  ShieldCheck,
  Package
} from 'lucide-react';

const SwapDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const socket = useSocket();

  const [swap, setSwap] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [exchangeMethod, setExchangeMethod] = useState('Local Exchange');

  const messagesEndRef = useRef(null);

  // Scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchSwapData();
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket.IO real-time message listener
  useEffect(() => {
    if (!socket || !id) return;

    // Join swap chat room
    socket.emit('join_swap', id);

    const handleReceiveMessage = (incomingMsg) => {
      setMessages((prev) => {
        // Prevent duplicate appending
        if (prev.some((m) => m._id === incomingMsg._id)) return prev;
        return [...prev, incomingMsg];
      });
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.emit('leave_swap', id);
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket, id]);

  const fetchSwapData = async () => {
    try {
      setLoading(true);
      setError('');
      const [swapRes, messagesRes] = await Promise.all([
        getSwapById(id),
        getMessages(id)
      ]);
      setSwap(swapRes.swap);
      setMessages(messagesRes.messages || []);
      if (swapRes.swap?.exchangeMethod && swapRes.swap.exchangeMethod !== 'Undecided') {
        setExchangeMethod(swapRes.swap.exchangeMethod);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load swap details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim() || sendingMessage) return;

    try {
      setSendingMessage(true);
      const res = await sendMessage(id, newMessageText.trim());
      setMessages((prev) => {
        if (prev.some((m) => m._id === res.message._id)) return prev;
        return [...prev, res.message];
      });
      setNewMessageText('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleAccept = async () => {
    try {
      setActionLoading(true);
      const res = await acceptSwap(id);
      setSwap(res.swap);
      fetchSwapData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept swap');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!window.confirm('Are you sure you want to decline this swap proposal?')) return;
    try {
      setActionLoading(true);
      const res = await rejectSwap(id);
      setSwap(res.swap);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject swap');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this swap?')) return;
    try {
      setActionLoading(true);
      const res = await cancelSwap(id);
      setSwap(res.swap);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel swap');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirm = async () => {
    try {
      setActionLoading(true);
      const res = await confirmSwap(id, { exchangeMethod });
      setSwap(res.swap);
      fetchSwapData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to confirm swap terms');
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!window.confirm('Confirm that you have physically received the item? This will mark the swap as completed and archive both items.')) {
      return;
    }
    try {
      setActionLoading(true);
      const res = await completeSwap(id);
      setSwap(res.swap);
      fetchSwapData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to mark swap as complete');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading negotiation workspace..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchSwapData} />;
  if (!swap) return null;

  const isRequester = user?._id === swap.requester?._id;
  const isOwner = user?._id === swap.owner?._id;
  const partnerUser = isRequester ? swap.owner : swap.requester;
  const myConfirmed = isRequester ? swap.requesterConfirmed : swap.ownerConfirmed;
  const partnerConfirmed = isRequester ? swap.ownerConfirmed : swap.requesterConfirmed;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Bar Navigation & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-earth-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/swaps')}
            className="p-2 rounded-xl text-earth-600 hover:text-earth-900 hover:bg-earth-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-earth-900">
                Swap Negotiation & Details
              </h1>
              <StatusBadge status={swap.status} />
            </div>
            <p className="text-xs text-earth-500 mt-0.5">
              Trading with {partnerUser?.name} ({partnerUser?.city}, {partnerUser?.state})
            </p>
          </div>
        </div>

        {/* Status indicator summary */}
        <div className="text-right text-xs">
          <span className="text-earth-400 block">Current Stage</span>
          <span className="font-bold text-forest-800">
            {swap.status === 'Completed'
              ? '🎉 Successfully Swapped'
              : swap.status === 'Confirmed'
              ? '🤝 Confirmed & Locked'
              : swap.status === 'Accepted' || swap.status === 'Negotiating'
              ? '💬 Chatting & Terms Alignment'
              : '⏳ Awaiting Recipient Review'}
          </span>
        </div>
      </div>

      {/* Main Workspace: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Items, Value Comparison & Confirmation Actions */}
        <div className="lg:col-span-7 space-y-6">
          {/* Comparison Card */}
          <SwapValueCompare
            offeredItem={swap.offeredItem}
            requestedItem={swap.requestedItem}
          />

          {/* Workflow Stage Action Card */}
          <div className="bg-white rounded-3xl border border-earth-200 shadow-sm p-6 space-y-5">
            <h3 className="text-sm font-bold text-earth-800 uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-forest-600" />
              Swap Status & Action Controls
            </h3>

            {/* Case 1: Pending */}
            {swap.status === 'Pending' && (
              <div className="space-y-4">
                {isOwner ? (
                  <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 space-y-3">
                    <p className="text-xs font-semibold text-amber-900">
                      {partnerUser?.name} sent this swap offer for your item. You can accept to open negotiation or decline.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={handleAccept}
                        disabled={actionLoading}
                        className="flex-1 py-2.5 px-4 bg-forest-600 hover:bg-forest-700 text-white text-xs font-bold rounded-xl transition shadow-sm disabled:opacity-50"
                      >
                        Accept Proposal
                      </button>
                      <button
                        onClick={handleReject}
                        disabled={actionLoading}
                        className="py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition disabled:opacity-50"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-earth-50 p-4 rounded-2xl border border-earth-200 flex items-center justify-between">
                    <p className="text-xs text-earth-600 font-medium">
                      Waiting for {partnerUser?.name} to review your proposal.
                    </p>
                    <button
                      onClick={handleCancel}
                      disabled={actionLoading}
                      className="text-xs font-semibold text-earth-600 hover:text-rose-600 transition"
                    >
                      Cancel Request
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Case 2: Accepted or Negotiating (Both must confirm) */}
            {['Accepted', 'Negotiating'].includes(swap.status) && (
              <div className="space-y-4">
                <div className="bg-forest-50/70 p-4 rounded-2xl border border-forest-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-forest-900">
                      Propose & Lock Final Swap Terms
                    </span>
                    <span className="text-[11px] text-forest-700 font-medium">
                      Both swappers must confirm
                    </span>
                  </div>

                  {/* Delivery / Exchange Method selection */}
                  <div>
                    <label className="block text-xs font-semibold text-earth-700 mb-1.5">
                      Exchange Method:
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setExchangeMethod('Local Exchange')}
                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                          exchangeMethod === 'Local Exchange'
                            ? 'bg-forest-600 text-white border-forest-600 shadow-xs'
                            : 'bg-white text-earth-700 border-earth-200 hover:bg-earth-50'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        Local Hand-off
                      </button>
                      <button
                        type="button"
                        onClick={() => setExchangeMethod('Courier/Shipping')}
                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                          exchangeMethod === 'Courier/Shipping'
                            ? 'bg-forest-600 text-white border-forest-600 shadow-xs'
                            : 'bg-white text-earth-700 border-earth-200 hover:bg-earth-50'
                        }`}
                      >
                        <Truck className="w-3.5 h-3.5" />
                        Courier / Postal
                      </button>
                    </div>
                  </div>

                  {/* Confirmation badges */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div
                      className={`p-2 rounded-xl text-center font-medium ${
                        myConfirmed
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-earth-100 text-earth-600'
                      }`}
                    >
                      {myConfirmed ? '✓ You Confirmed' : '○ You: Pending'}
                    </div>
                    <div
                      className={`p-2 rounded-xl text-center font-medium ${
                        partnerConfirmed
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-earth-100 text-earth-600'
                      }`}
                    >
                      {partnerConfirmed ? `✓ ${partnerUser?.name} Confirmed` : `○ ${partnerUser?.name}: Pending`}
                    </div>
                  </div>

                  {!myConfirmed ? (
                    <button
                      onClick={handleConfirm}
                      disabled={actionLoading}
                      className="w-full py-2.5 px-4 bg-forest-600 hover:bg-forest-700 text-white text-xs font-bold rounded-xl transition shadow-sm disabled:opacity-50"
                    >
                      Confirm Agreement & Lock Items
                    </button>
                  ) : (
                    <p className="text-center text-xs text-forest-700 font-semibold py-1">
                      You have confirmed terms! Waiting for {partnerUser?.name} to confirm.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Case 3: Confirmed (Locked, ready for exchange and completion) */}
            {swap.status === 'Confirmed' && (
              <div className="bg-indigo-50/80 p-5 rounded-2xl border border-indigo-200 space-y-4">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                  <CheckCircle className="w-5 h-5 text-indigo-600" />
                  <span>Swap is Confirmed & Locked!</span>
                </div>
                <p className="text-xs text-indigo-700 leading-relaxed">
                  Method selected: <strong className="font-semibold">{swap.exchangeMethod || 'Local Exchange'}</strong>.
                  Coordinate location or tracking info via the chat. Once you have received your exchanged clothing, click below to mark the trade completed.
                </p>

                <button
                  onClick={handleComplete}
                  disabled={actionLoading}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark Swap Completed
                </button>
              </div>
            )}

            {/* Case 4: Completed */}
            {swap.status === 'Completed' && (
              <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200 text-center space-y-2">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCheck className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-emerald-900">Exchange Complete!</h4>
                <p className="text-xs text-emerald-700">
                  Both clothing items are now moved to "Swapped" status. Thank you for championing circular sustainable fashion!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Negotiation Chat */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-earth-200 shadow-sm flex flex-col h-[650px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-earth-100 bg-earth-50/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-forest-100 text-forest-800 font-bold flex items-center justify-center text-xs overflow-hidden">
                {partnerUser?.profileImage ? (
                  <img src={partnerUser.profileImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  partnerUser?.name?.charAt(0) || 'U'
                )}
              </div>
              <div>
                <span className="text-xs font-bold text-earth-900 block truncate">
                  {partnerUser?.name}
                </span>
                <span className="text-[10px] text-forest-700 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active in swap discussion
                </span>
              </div>
            </div>

            <div className="text-[11px] text-earth-400 font-medium">
              Private Chat
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#fdfdfc]">
            {messages.length === 0 ? (
              <div className="text-center py-12 text-earth-400 text-xs">
                <MessageSquare className="w-8 h-8 mx-auto text-earth-300 mb-2" />
                No messages yet. Send a message to coordinate swap terms!
              </div>
            ) : (
              messages.map((msg) => {
                const isMine = msg.sender?._id === user?._id || msg.sender === user?._id;
                return (
                  <div
                    key={msg._id}
                    className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs shadow-xs leading-relaxed ${
                        isMine
                          ? 'bg-forest-600 text-white rounded-tr-xs'
                          : 'bg-earth-100 text-earth-900 rounded-tl-xs'
                      }`}
                    >
                      <p>{msg.message}</p>
                    </div>
                    <span className="text-[10px] text-earth-400 mt-1 px-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-earth-100 bg-white flex items-center gap-2"
          >
            <input
              type="text"
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              placeholder="Type message to negotiate swap..."
              disabled={['Cancelled', 'Rejected'].includes(swap.status)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-earth-200 text-xs text-earth-900 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-earth-50/50 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={sendingMessage || !newMessageText.trim() || ['Cancelled', 'Rejected'].includes(swap.status)}
              className="p-2.5 bg-forest-600 hover:bg-forest-700 text-white rounded-xl shadow-xs transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SwapDetailPage;
